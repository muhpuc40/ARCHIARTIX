/**
 * Runs supabase/schema.sql + policies.sql + seed.sql against an in-memory
 * Postgres (PGlite) with minimal Supabase stubs (auth.uid(), roles, storage),
 * then proves the security guarantees:
 *   - customers can't read other customers' orders
 *   - customers can't mutate products, orders, or their own role
 *   - orders only come from create_order() (prices from DB, stock locked)
 *   - order status transitions are enforced, cancelling restores stock
 *
 *   npm run test:sql
 */
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sql = (f) => readFileSync(join(root, "supabase", f), "utf8");

const db = new PGlite();

const STUBS = `
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key default gen_random_uuid(), email varchar, raw_user_meta_data jsonb default '{}'::jsonb);
  create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
  create function auth.role() returns text language sql stable as $$ select auth.jwt() ->> 'role' $$;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
`;
// Mirrors Supabase's default privileges: objects created in `public` are granted to the API roles.
const GRANTS_BEFORE = `
  grant usage on schema public, auth, storage to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
`;
const GRANTS_AFTER = `
  grant select on auth.users to service_role;
  grant all on storage.objects to anon, authenticated, service_role;
  grant select on storage.buckets to anon, authenticated, service_role;
`;

let passed = 0;
let failed = 0;
const ok = (name) => { passed++; console.log(`  ✓ ${name}`); };
const bad = (name, extra = "") => { failed++; console.log(`  ✗ ${name} ${extra}`); };

async function as(role, uid, fn) {
  const claims = JSON.stringify(uid ? { role, sub: uid, email: `${uid.slice(0, 4)}@test.dev` } : { role });
  await db.exec(`select set_config('request.jwt.claims', '${claims}', false); set role ${role};`);
  try { return await fn(); } finally { await db.exec("reset role;"); }
}
const expectOk = async (name, p) => { try { const r = await p(); ok(name); return r; } catch (e) { bad(name, `→ ${e.message}`); } };
const expectFail = async (name, p, match) => {
  try { await p(); bad(name, "(expected an error but it succeeded)"); }
  catch (e) { (!match || e.message.includes(match)) ? ok(name) : bad(name, `→ wrong error: ${e.message}`); }
};
const count = async (q) => Number((await db.query(q)).rows[0].c);

await db.exec(STUBS);
await db.exec(GRANTS_BEFORE);
console.log("Applying schema.sql …");   await db.exec(sql("schema.sql"));
console.log("Applying policies.sql …"); await db.exec(sql("policies.sql"));
await db.exec(GRANTS_AFTER);
if (existsSync(join(root, "supabase", "seed.sql"))) { console.log("Applying seed.sql …"); await db.exec(sql("seed.sql")); }

const A = "11111111-1111-4111-8111-111111111111"; // admin
const B = "22222222-2222-4222-8222-222222222222"; // customer
const C = "33333333-3333-4333-8333-333333333333"; // customer
for (const [id, n] of [[A, "admin"], [B, "bob"], [C, "carol"]]) {
  await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)", [id, `${n}@test.dev`, JSON.stringify({ full_name: n })]);
}

console.log("\nSignup trigger");
(await count("select count(*) c from profiles") === 3) ? ok("profiles auto-created for every auth user") : bad("profiles auto-created");
await db.exec(`update profiles set role='admin' where id='${A}'`); // as owner (SQL editor / seed-admin)

await db.exec(`
  insert into products (id, name, slug, price_bdt, stock, is_published) values
   ('aaaaaaaa-0000-4000-8000-000000000001','Lamp','lamp',1000,5,true),
   ('aaaaaaaa-0000-4000-8000-000000000002','Hidden','hidden',500,5,false),
   ('aaaaaaaa-0000-4000-8000-000000000003','Rare','rare',2500,1,true)
  on conflict (id) do nothing;
`);
const P1 = "aaaaaaaa-0000-4000-8000-000000000001";
const P2 = "aaaaaaaa-0000-4000-8000-000000000002";
const P3 = "aaaaaaaa-0000-4000-8000-000000000003";
let payN = 0;
const pay = (n) => ({ method: "bkash", sender: "01712345678", trx_id: `TRX${String(n).padStart(7, "0")}` });
const ship = { name: "Bob Builder", phone: "01712345678", address: "House 1, Road 2, Dhanmondi", city: "Dhaka" };

console.log("\nPublic access (anon)");
await as("anon", null, async () => {
  const r = await db.query("select count(*) c from products");
  Number(r.rows[0].c) === (await count("select count(*) c from products where is_published")) || true;
});
const anonSees = await as("anon", null, async () => (await db.query("select slug from products order by slug")).rows.map((r) => r.slug));
(!anonSees.includes("hidden") && anonSees.includes("lamp")) ? ok("anon sees published products only") : bad("anon sees published only", JSON.stringify(anonSees));
await as("anon", null, () => expectFail("anon cannot insert products", () => db.query("insert into products (name, slug, price_bdt) values ('x','x',1)")));
await as("anon", null, () => expectFail("anon cannot call create_order", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify(pay(++payN))]), "permission denied"));
await as("anon", null, async () => { const r = await db.query("select count(*) c from orders"); Number(r.rows[0].c) === 0 ? ok("anon sees no orders") : bad("anon sees orders"); });

console.log("\nCustomer (Bob) orders through create_order()");
const order = await as("authenticated", B, () => expectOk("create_order succeeds", async () =>
  (await db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb) r", [JSON.stringify([{ product_id: P1, quantity: 2 }, { product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify(pay(++payN))])).rows[0].r));
if (order) {
  order.total_bdt === 3000 ? ok("total computed from DB prices, duplicate lines merged (3 × ৳1000)") : bad("total", JSON.stringify(order));
  (await count(`select stock c from products where id='${P1}'`)) === 2 ? ok("stock decremented atomically (5 → 2)") : bad("stock decrement");
  (await count(`select count(*) c from order_items where order_id='${order.id}'`)) === 1 ? ok("one merged order line written") : bad("order_items");
}
await as("authenticated", B, () => expectFail("cannot order unpublished product", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P2, quantity: 1 }]), JSON.stringify(ship), JSON.stringify(pay(++payN))]), "no longer available"));
await as("authenticated", B, () => expectFail("cannot order more than stock", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P3, quantity: 2 }]), JSON.stringify(ship), JSON.stringify(pay(++payN))]), "Only 1 left"));
await as("authenticated", B, () => expectFail("rejects invalid shipping phone", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P3, quantity: 1 }]), JSON.stringify({ ...ship, phone: "123" }), JSON.stringify(pay(++payN))]), "delivery details"));
await as("authenticated", B, () => expectFail("rejects empty cart", () => db.query("select create_order('[]'::jsonb,$1::jsonb,$2::jsonb)", [JSON.stringify(ship), JSON.stringify(pay(++payN))]), "empty"));
await as("authenticated", B, () => expectFail("cannot INSERT into orders directly", () => db.query(`insert into orders (user_id, total_bdt, shipping_address) values ('${B}', 1, '{}')`)));
await as("authenticated", B, () => expectFail("cannot INSERT into order_items directly", () => db.query(`insert into order_items (order_id, product_name, quantity, unit_price_bdt) values ('${order?.id}', 'x', 1, 1)`)));

console.log("\nIsolation between customers");
await as("authenticated", C, async () => {
  (await count("select count(*) c from orders")) === 0 ? ok("Carol cannot read Bob's orders") : bad("Carol sees Bob's orders");
  (await count("select count(*) c from order_items")) === 0 ? ok("Carol cannot read Bob's order items") : bad("Carol sees order items");
  (await count("select count(*) c from profiles")) === 1 ? ok("Carol only sees her own profile") : bad("profiles leak");
});
await as("authenticated", B, async () => {
  (await count("select count(*) c from orders")) === 1 ? ok("Bob reads his own order") : bad("Bob own order");
  (await count("select count(*) c from order_items")) === 1 ? ok("Bob reads his own order items") : bad("Bob own items");
});

console.log("\nCustomers cannot mutate protected data");
await as("authenticated", B, async () => {
  await expectFail("cannot escalate own role to admin", () => db.query(`update profiles set role='admin' where id='${B}'`), "cannot change account roles");
  await expectFail("cannot insert an admin profile for someone else", () => db.query(`insert into profiles (id, role) values ('${C}', 'admin')`));
  await expectOk("can update own name/phone", () => db.query(`update profiles set full_name='Bobby', phone='01712345678' where id='${B}'`));
  const r = await db.query("update products set price_bdt = 1 returning id"); r.rows.length === 0 ? ok("cannot update products (0 rows affected)") : bad("product update leaked");
  const d = await db.query("delete from products returning id"); d.rows.length === 0 ? ok("cannot delete products (0 rows affected)") : bad("product delete leaked");
  const o = await db.query("update orders set status='delivered' returning id"); o.rows.length === 0 ? ok("cannot change order status (0 rows affected)") : bad("order update leaked");
  await expectFail("cannot read inquiries", async () => { const q = await db.query("select * from inquiries"); if (q.rows.length) throw new Error("rows"); else throw new Error("empty-as-expected"); }, "empty-as-expected");
  await expectFail("cannot call admin_dashboard_stats", () => db.query("select admin_dashboard_stats()"), "Admins only");
  await expectFail("cannot call admin_list_customers", () => db.query("select * from admin_list_customers()"), "Admins only");
});
await as("authenticated", B, () => expectFail("cannot insert into storage bucket", () => db.query("insert into storage.objects (bucket_id, name) values ('products','evil.png')")));

console.log("\nPayments (bKash / Nagad)");
const o2 = await as("authenticated", C, () => expectOk("order stores method, sender and TrxID", async () =>
  (await db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb) r", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify({ method: "nagad", sender: "01812345678", trx_id: "abc123def9" })])).rows[0].r));
if (o2) {
  const row = (await db.query(`select payment_method m, payment_sender s, payment_ref r from orders where id='${o2.id}'`)).rows[0];
  (row.m === "nagad" && row.s === "01812345678" && row.r === "ABC123DEF9") ? ok("payment fields saved (TrxID upper-cased)") : bad("payment fields", JSON.stringify(row));
}
await as("authenticated", C, () => expectFail("same TrxID cannot be reused", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify({ method: "bkash", sender: "01712345678", trx_id: "ABC123DEF9" })]), "already been used"));
await as("authenticated", C, () => expectFail("card / COD methods are rejected", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify({ method: "card", sender: "01712345678", trx_id: "ZZZ999AAA1" })]), "transaction ID"));
await as("authenticated", C, () => expectFail("missing TrxID is rejected", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify({ method: "bkash", sender: "01712345678", trx_id: "" })]), "transaction ID"));
await as("authenticated", C, () => expectFail("invalid sender number is rejected", () => db.query("select create_order($1::jsonb,$2::jsonb,$3::jsonb)", [JSON.stringify([{ product_id: P1, quantity: 1 }]), JSON.stringify(ship), JSON.stringify({ method: "bkash", sender: "12345", trx_id: "QWE456RTY7" })]), "transaction ID"));

console.log("\nTestimonials & estimates");
await db.exec(`update testimonials set is_published=false where sort_order=3`);
const anonT = await as("anon", null, async () => (await db.query("select count(*) c from testimonials")).rows[0].c);
Number(anonT) === 2 ? ok("anon sees only published testimonials") : bad("anon testimonials", String(anonT));
await as("anon", null, async () => { const r = await db.query("update testimonials set quote='x' returning id"); r.rows.length === 0 ? ok("anon cannot edit testimonials") : bad("anon edit leaked"); });
await as("authenticated", B, async () => {
  await expectFail("customer cannot add testimonials", () => db.query("insert into testimonials (name, quote) values ('x','hello world long')"));
  (await count("select count(*) c from estimates")) === 0 ? ok("customer cannot read estimates") : bad("estimates leak");
  await expectFail("customer cannot insert estimates directly", () => db.query("insert into estimates (space_kind, flat_status, package, name, phone) values ('Home','ready_for_interior','standard','x','01712345678')"));
});
await db.exec(`insert into estimates (space_kind, flat_status, rooms, package, name, phone) values ('Residential','ready_for_interior','[{"name":"Bedroom","count":2}]'::jsonb,'superior','Rafi','01712345678')`);
await as("authenticated", A, async () => {
  (await count("select count(*) c from estimates")) === 1 ? ok("admin reads estimates") : bad("admin estimates");
  await expectOk("admin can add a testimonial", () => db.query("insert into testimonials (name, quote) values ('New client','Brilliant team, on time and on budget.')"));
  await expectOk("admin can update estimate status", () => db.query("update estimates set status='contacted'"));
  (await count("select count(*) c from testimonials")) === 4 ? ok("admin sees drafts too") : bad("admin testimonials");
});

console.log("\nAdmin");
await as("authenticated", A, async () => {
  (await count("select count(*) c from orders")) === 2 ? ok("admin reads all orders") : bad("admin orders");
  (await count("select count(*) c from products where not is_published")) === 1 ? ok("admin sees unpublished products too") : bad("admin products");
  await expectOk("admin can create products", () => db.query("insert into products (name, slug, price_bdt, stock) values ('New','new',100,1)"));
  await expectOk("admin can upload to storage bucket", () => db.query("insert into storage.objects (bucket_id, name) values ('products','ok.png')"));
  const stats = (await db.query("select admin_dashboard_stats() s")).rows[0].s;
  (stats.orders === 2 && stats.revenue_bdt === 4000 && stats.pending_orders === 2 && stats.new_estimates === 0) ? ok(`dashboard stats correct (${JSON.stringify(stats)})`) : bad("stats", JSON.stringify(stats));
  const cust = (await db.query("select * from admin_list_customers()")).rows;
  (cust.length === 3 && cust.find((c) => c.id === B)?.order_count == 1) ? ok("customer list with order counts") : bad("customers", JSON.stringify(cust));

  await expectFail("pending → delivered is rejected", () => db.query(`update orders set status='delivered' where id='${order.id}'`), "Cannot move an order");
  await expectOk("pending → confirmed", () => db.query(`update orders set status='confirmed' where id='${order.id}'`));
  await expectFail("cannot edit order total", () => db.query(`update orders set total_bdt = 1 where id='${order.id}'`), "Only the order status");
  await expectOk("confirmed → cancelled", () => db.query(`update orders set status='cancelled' where id='${order.id}'`));
  (await count(`select stock c from products where id='${P1}'`)) === 4 ? ok("cancelling restores stock (1 → 4, Carol's unit still held)") : bad("stock restore");
  await expectFail("cancelled is final", () => db.query(`update orders set status='confirmed' where id='${order.id}'`), "Cannot move an order");
});

console.log(`\n${failed === 0 ? "ALL PASSED" : "FAILURES"} — ${passed} passed, ${failed} failed`);
await db.close();
process.exit(failed === 0 ? 0 : 1);
