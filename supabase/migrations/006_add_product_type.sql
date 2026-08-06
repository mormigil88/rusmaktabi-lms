-- Add product_type so `courses` can host non-course digital products
-- (e.g. document checklists) without any changes to checkout/payments/enrollments,
-- which already key off course_id/slug generically.

alter table public.courses
  add column product_type text not null default 'course'
  check (product_type in ('course', 'digital_product'));
