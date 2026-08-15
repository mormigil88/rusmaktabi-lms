'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// ─── Click (Узбекистан, UZS) ────────────────────────────────────────────────

interface ClickInput {
  courseId: string
  courseSlug: string
  courseTitle: string
  priceUzs: number
}

export async function initiateClick(input: ClickInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const SERVICE_ID = process.env.CLICK_SERVICE_ID
  const MERCHANT_ID = process.env.CLICK_MERCHANT_ID
  // SECRET_KEY нужен только для webhook-проверки, не для URL
  if (!SERVICE_ID || !MERCHANT_ID) return { error: 'Click not configured' }

  // 1. Создаём pending payment в БД — merchant_trans_id для Click
  const service = createServiceClient()
  const { data: payment, error } = await service
    .from('payments')
    .insert({
      user_id: user.id,
      course_id: input.courseId,
      amount: input.priceUzs,
      currency: 'UZS',
      provider: 'click',
      status: 'pending',
    } as never)
    .select('id')
    .single() as { data: { id: string } | null, error: unknown }

  if (error || !payment) return { error: 'Failed to create payment' }

  // 2. Редирект на Click — sign_string НЕ нужен (простой GET без подписи).
  //    Подпись проверяется только в webhook (Prepare/Complete).
  //    Параметр называется transaction_param (не transaction_id) — источник:
  //    github.com/Iqbolshoh/php-click-payment (index.php).
  const qs = new URLSearchParams({
    service_id: SERVICE_ID,
    merchant_id: MERCHANT_ID,
    amount: String(input.priceUzs),
    transaction_param: payment.id,
    return_url: `${APP_URL}/course/${input.courseSlug}/success`,
  })

  const url = `https://my.click.uz/services/pay?${qs.toString()}`
  return { url }
}

// ─── YooKassa ────────────────────────────────────────────────────────────────

interface YooKassaInput {
  courseId: string
  courseSlug: string
  courseTitle: string
  priceRub: number
}

export async function initiateYooKassa(input: YooKassaInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const SHOP_ID = process.env.YOOKASSA_SHOP_ID
  const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY
  if (!SHOP_ID || !SECRET_KEY) return { error: 'YooKassa not configured' }

  const service = createServiceClient()
  const { data: payment, error } = await service
    .from('payments')
    .insert({
      user_id: user.id,
      course_id: input.courseId,
      amount: input.priceRub,
      currency: 'RUB',
      provider: 'yookassa',
      status: 'pending',
    } as never)
    .select('id')
    .single() as { data: { id: string } | null, error: unknown }

  if (error || !payment) return { error: 'Failed to create payment' }

  const idempotenceKey = payment.id

  const response = await fetch('https://api.yookassa.ru/v2/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': idempotenceKey,
      Authorization: `Basic ${Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: { value: input.priceRub.toFixed(2), currency: 'RUB' },
      confirmation: {
        type: 'redirect',
        return_url: `${APP_URL}/course/${input.courseSlug}/success`,
      },
      description: `Kurs: ${input.courseTitle}`,
      metadata: { payment_db_id: payment.id },
      capture: true,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    return { error: err.description ?? 'YooKassa error' }
  }

  const data = await response.json()

  // Store external ID
  await service
    .from('payments')
    .update({ external_id: data.id } as never)
    .eq('id', payment.id)

  return { url: data.confirmation.confirmation_url }
}
