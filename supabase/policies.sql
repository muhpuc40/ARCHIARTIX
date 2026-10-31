-- =====================================================================
-- ARCHIAETIX — Row Level Security + Storage policies
-- Run AFTER schema.sql. Safe to re-run.
-- Principle: deny by default; every table has RLS enabled.
-- =====================================================================

alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.projects    enable row level security;
alter table public.services    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries   enable row level security;
alter table public.testimonials enable row level security;
alter table public.hero_slides enable row level security;
alter table public.site_settings enable row level security;
alter table public.estimates   enable row level security;

-- ---------------------------------------------------------------- profiles
drop policy if exists "profiles: read own"        on public.profiles;
drop policy if exists "profiles: admins read all" on public.profiles;
drop policy if exists "profiles: insert own"      on public.profiles;
drop policy if exists "profiles: update own"      on public.profiles;

create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles: admins read all" on public.profiles
  for select using (public.is_admin());

-- fallback creation when the signup trigger missed — can only ever be a customer
create policy "profiles: insert own" on public.profiles
  for insert with check (id = auth.uid() and role = 'customer');

-- role changes are additionally blocked by the guard_profile_update trigger
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ------------------------------------------- public catalogue (read) + admin write
drop policy if exists "categories: public read" on public.categories;
drop policy if exists "categories: admin write" on public.categories;
create policy "categories: public read" on public.categories for select using (true);
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects: public read" on public.projects;
drop policy if exists "projects: admin write" on public.projects;
create policy "projects: public read" on public.projects for select using (true);
create policy "projects: admin write" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "services: public read" on public.services;
drop policy if exists "services: admin write" on public.services;
create policy "services: public read" on public.services for select using (true);
create policy "services: admin write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products: read published" on public.products;
drop policy if exists "products: admin write"    on public.products;
create policy "products: read published" on public.products
  for select using (is_published = true or public.is_admin());
create policy "products: admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------------ orders
-- No INSERT policy on purpose: orders are created only through create_order().
drop policy if exists "orders: read own or admin" on public.orders;
drop policy if exists "orders: admin update"      on public.orders;
create policy "orders: read own or admin" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
create policy "orders: admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items: read own or admin" on public.order_items;
create policy "order_items: read own or admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- --------------------------------------------------------------- inquiries
-- Public form posts go through the server (service role). Only admins read/manage them.
drop policy if exists "inquiries: admin all" on public.inquiries;
create policy "inquiries: admin all" on public.inquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------ testimonials
drop policy if exists "testimonials: read published" on public.testimonials;
drop policy if exists "testimonials: admin write"    on public.testimonials;
create policy "testimonials: read published" on public.testimonials
  for select using (is_published = true or public.is_admin());
create policy "testimonials: admin write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------- hero_slides
drop policy if exists "hero_slides: read published" on public.hero_slides;
drop policy if exists "hero_slides: admin write"    on public.hero_slides;
create policy "hero_slides: read published" on public.hero_slides
  for select using (is_published = true or public.is_admin());
create policy "hero_slides: admin write" on public.hero_slides
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------- site_settings
drop policy if exists "site_settings: public read" on public.site_settings;
drop policy if exists "site_settings: admin write" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select using (true);
create policy "site_settings: admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------- estimates
-- Public wizard posts go through the server (service role). Only admins read/manage them.
drop policy if exists "estimates: admin all" on public.estimates;
create policy "estimates: admin all" on public.estimates
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- storage
-- Images and video are stored on Cloudinary now. The Supabase buckets below are
-- no longer used by the app; they are left in place (and locked to admins for
-- writes) so older uploads keep working.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('projects', 'projects', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "images: public read"  on storage.objects;
drop policy if exists "images: admin insert" on storage.objects;
drop policy if exists "images: admin update" on storage.objects;
drop policy if exists "images: admin delete" on storage.objects;

create policy "images: public read" on storage.objects
  for select using (bucket_id in ('products', 'projects'));

create policy "images: admin insert" on storage.objects
  for insert with check (bucket_id in ('products', 'projects') and public.is_admin());

create policy "images: admin update" on storage.objects
  for update using (bucket_id in ('products', 'projects') and public.is_admin())
  with check (bucket_id in ('products', 'projects') and public.is_admin());

create policy "images: admin delete" on storage.objects
  for delete using (bucket_id in ('products', 'projects') and public.is_admin());
