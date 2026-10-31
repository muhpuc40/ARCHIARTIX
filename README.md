# ARCHIAETIX — Art Meets Architecture

Website, shop and admin panel for the ARCHIAETIX interior design & architecture studio.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Supabase (Postgres, Auth, Storage) · Zod + React Hook Form.

The site runs **without Supabase** (sample content, WhatsApp checkout fallback) so you can see it immediately. Connect Supabase to turn on sign-in, orders, inquiries and the admin panel.

---

## 1. Run it locally (Windows PowerShell)

```powershell
cd E:\ARCHIAETIX
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. Edit `.env.local` as you go (restart `npm run dev` after changes).

Other commands: `npm run build` · `npm start` · `npm run lint` · `npm run typecheck` · `npm run test:sql` (tests the database rules locally).

## 2. Set up Supabase

1. Create a project at https://supabase.com.
2. **Project Settings → API**: copy the Project URL, `anon` key and `service_role` key into `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
   The service-role key is server-only — never share it or prefix it with `NEXT_PUBLIC_`.
3. **SQL Editor** → run these files, in this order (each is safe to re-run):
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. `supabase/seed.sql` (sample categories, projects, services, products)
4. **Authentication → URL Configuration**: set *Site URL* to your site address and add these *Redirect URLs*:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-DOMAIN/auth/callback`

### Google sign-in
1. Google Cloud Console → *APIs & Services → Credentials → Create OAuth client ID* (Web application).
2. Add the **Authorized redirect URI** shown in Supabase under *Authentication → Providers → Google*
   (looks like `https://YOUR-PROJECT.supabase.co/auth/v1/callback`).
3. Paste the Client ID and Secret into that Supabase provider screen and enable it.

Email magic-link sign-in works out of the box as a fallback.

### Create the admin account (email + password)
Put these in `.env.local`:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password
```

then run:

```powershell
npm run seed:admin
```

Sign in at **http://localhost:3000/admin/login**. Re-running the command resets the password to the one in `.env.local`. Customers keep using Google / magic link on the normal sign-in page; the admin panel is only for the admin account. Admin access is checked on the server for every page and API call, and the role cannot be changed from the browser.

### Updating an existing database
If you already ran the SQL files before, just run `supabase/schema.sql` and then `supabase/policies.sql` again (both are safe to re-run). This adds testimonials, estimates and the bKash/Nagad payment fields. Run `seed.sql` again to add the sample testimonials.

## 3. Cloudinary (images + video)
All uploads in the admin panel (product photos, project photos, testimonial photos) go to Cloudinary. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from your Cloudinary dashboard to `.env.local`. Uploads are signed on the server, so the secret never reaches the browser.
For the hero video and the 3D view, upload the video to Cloudinary yourself and paste its URL into `NEXT_PUBLIC_HERO_VIDEO_URL` / `NEXT_PUBLIC_3D_VIEW_URL`.

## 4. Your content

| What | Where |
|---|---|
| Phone, email, address, WhatsApp number, social links | `.env.local` (see `.env.example`) |
| Hero background video (optional) | `NEXT_PUBLIC_HERO_VIDEO_URL` (Cloudinary URL) |
| 3D view in “Walk through your space” | `NEXT_PUBLIC_3D_VIEW_URL` |
| Logos | `public/brand/` |
| Products, projects, testimonials (with photos) | Admin panel |
| Estimate requests from “Make your plan” | Admin panel → Estimates |
| Services, categories | Supabase **Table Editor** |
| Rooms, add-ons and packages in “Make your plan” | `lib/estimate.ts` |
| Text content, FAQ, team, stats | `lib/content.ts` |

> **Placeholder content:** the sample projects, products, testimonials, team roles and statistics were invented so the site looks complete. **Replace them before launch.**

## 5. Shop & payments
Customers pay by **bKash or Nagad Send Money** to **01818173025** (change it with `NEXT_PUBLIC_BKASH_NUMBER` / `NEXT_PUBLIC_NAGAD_NUMBER`). At checkout they enter the number they paid from and the transaction ID (TrxID). Each TrxID can only be used once. In **Admin → Orders**, check the payment in your bKash/Nagad app and press **Confirm order**, then move it to shipped / delivered.
Prices are in BDT (৳) and are always recalculated on the server from the database — the browser cannot change a price. Delivery fees are not added to totals yet.

## 6. Deploying (Vercel)
1. Push to GitHub and import the repo in Vercel.
2. Add every variable from `.env.example` (except `ADMIN_PASSWORD` — run the seed command locally against the same Supabase project instead) in *Project → Settings → Environment Variables* (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. Add the production callback URL to Supabase (step 2.4) and Google (step 2 of Google sign-in).

## 7. Security notes
- Row Level Security is on for every table; customers can only read their own orders and profile.
- Orders are created by a database function that locks stock rows, so two buyers can't oversell the last unit.
- Mutating API routes check the request origin (CSRF), validate input with Zod, and the contact form has a honeypot + rate limit.
- The in-memory rate limiter is per server instance; use Upstash/Redis for strict limits at scale.

## 8. Notes for developers
- Next 16: `proxy.ts` replaces `middleware.ts`; `params`/`searchParams`/`cookies` are async.
- `cacheComponents` is off in `next.config.ts`. Public pages use ISR (`revalidate = 60`); account/admin pages are dynamic.
- Offline support: `public/sw.js` caches static assets and shows `/offline` when there is no connection; it never caches API, admin, account, checkout or login pages. It only registers in production builds.
