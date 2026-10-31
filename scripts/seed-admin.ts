/**
 * Creates (or updates) the admin account from .env.local and makes it an admin.
 *   npm run seed:admin
 * Needs: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
 * Optional: ADMIN_NAME. Safe to re-run — it resets the password to the one in .env.local.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Admin";

if (!url || !key || !email || !password) {
  console.error("Missing env. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser(target: string) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target);
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  const adminEmail = email as string;
  const adminPassword = password as string;
  let user = await findUser(adminEmail);
  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password: adminPassword, email_confirm: true });
    if (error) {
      console.error("Could not update the existing user:", error.message);
      process.exit(1);
    }
    console.log(`• Updated password for existing account ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({ email: adminEmail, password: adminPassword, email_confirm: true, user_metadata: { full_name: name } });
    if (error || !data.user) {
      console.error("Could not create the admin user:", error?.message);
      process.exit(1);
    }
    user = data.user;
    console.log(`• Created account ${email}`);
  }

  const { error } = await supabase.from("profiles").upsert({ id: user.id, role: "admin", full_name: name }, { onConflict: "id" });
  if (error) {
    console.error("Could not set the admin role:", error.message);
    process.exit(1);
  }
  console.log(`✓ ${email} is an admin. Sign in at /admin/login`);
}

main().catch((e) => {
  console.error("Failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
