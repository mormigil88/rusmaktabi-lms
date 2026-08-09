-- 008: Marketing decision 2026-08-09 — turn OFF the $200 intensive course,
-- turn ON the document checklist mini-product.
-- Reversible: flip statuses back if needed (intensive → 'published', checklist → 'draft').

-- 1) Hide the intensive from public listings and checkout.
--    Keeps the row so existing enrollments / lessons / videos remain intact.
update public.courses
  set status = 'draft'
  where slug = 'rus-tili-intensivi'
    and product_type = 'course';

-- 2) Publish the document checklist so the CTA on /maqolalar/[slug] shows the buy button.
--    PDF upload is done via /admin/courses/<id> — this migration only flips the flag.
update public.courses
  set status = 'published'
  where slug = 'chek-list-hujjatlar-qabul'
    and product_type = 'digital_product';
