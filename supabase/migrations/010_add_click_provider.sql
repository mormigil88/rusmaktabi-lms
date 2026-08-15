-- 010_add_click_provider.sql
-- Добавляем 'click' в CHECK constraint на payments.provider
-- Click (Узбекистан) вместо Payme — 09.08.2026

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_provider_check
  CHECK (provider IN ('payme', 'click', 'yookassa', 'manual'));
