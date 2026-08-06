-- Seed: digital product — checklist + document templates for Russian school admission.
-- Kept as `draft` on purpose: price_uzs below is a PLACEHOLDER and must be confirmed
-- by the project owner before this is published (toggle in /admin/courses).

insert into public.courses (title, slug, description, price_uzs, price_rub, language, status, product_type)
values (
  'Chek-list va hujjat shablonlari — maktabga qabul',
  'chek-list-hujjatlar-qabul',
  'Bolangizni Rossiya maktabiga qabul qilish uchun kerakli hujjatlar ro''yxati va tayyor shablonlar. Bosqichma-bosqich chek-list — hech narsani unutmaysiz.',
  49000, -- TODO: confirm real price with the project owner before publishing
  0,
  'uz',
  'draft',
  'digital_product'
);
