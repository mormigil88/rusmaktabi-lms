-- 009 — secure file delivery for digital products
-- Adds file_path column on courses + private storage bucket + RLS so buyers
-- can only get the file through our signed-URL endpoint (never direct read).

-- 1. file_path storage pointer (path inside the bucket, e.g. 'chek-list-hujjatlar-qabul/v1.pdf')
alter table public.courses
  add column if not exists file_path text;

-- 2. Private bucket (public = false → no direct reads, only signed URLs)
insert into storage.buckets (id, name, public)
  values ('digital-products', 'digital-products', false)
  on conflict (id) do nothing;

-- 3. RLS policies on storage.objects — keep it locked except for service_role.
--    Authenticated users are blocked from select/insert/update/delete on
--    this bucket; the only path to a file is /api/download/[slug] which uses
--    service_role to mint a short-lived signed URL.

-- Drop any permissive policies that may have been auto-created.
drop policy if exists "digital_products_select_authenticated" on storage.objects;
drop policy if exists "digital_products_insert_authenticated" on storage.objects;
drop policy if exists "digital_products_update_authenticated" on storage.objects;
drop policy if exists "digital_products_delete_authenticated" on storage.objects;

-- Lock down: only service_role can read/write this bucket.
-- (service_role bypasses RLS entirely; we never want an end-user to read it directly.)
create policy "digital_products_service_role_all"
  on storage.objects for all
  to service_role
  using (bucket_id = 'digital-products')
  with check (bucket_id = 'digital-products');

-- 4. Helper view: admins can see which products have files attached (handy for sanity checks).
create or replace view public.admin_digital_products as
  select id, slug, title, file_path, status, product_type
  from public.courses
  where product_type = 'digital_product';

grant select on public.admin_digital_products to authenticated;
