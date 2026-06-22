import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// Payme JSON-RPC error codes
const ERRORS = {
  INVALID_AUTH:        { code: -32504, message: { ru: 'Недостаточно привилегий для выполнения метода', en: 'Insufficient privileges', uz: 'Usul bajarish uchun imtiyozlar yetarli emas' } },
  OPERATION_NOT_FOUND: { code: -31003, message: { ru: 'Транзакция не найдена', en: 'Transaction not found', uz: 'Tranzaksiya topilmadi' } },
  APP_DISABLED:        { code: -32400, message: { ru: 'Приложение недоступно', en: 'Application unavailable', uz: 'Ilova mavjud emas' } },
  ORDER_NOT_FOUND:     { code: -31050, message: { ru: 'Заказ не найден', en: 'Order not found', uz: 'Buyurtma topilmadi' } },
  ORDER_NOT_ALLOWED:   { code: -31051, message: { ru: 'Нельзя оплатить этот заказ', en: 'Cannot pay for this order', uz: 'Bu buyurtmani to\'lab bo\'lmaydi' } },
  WRONG_AMOUNT:        { code: -31001, message: { ru: 'Неверная сумма', en: 'Wrong amount', uz: 'Noto\'g\'ri summa' } },
  ALREADY_PAID:        { code: -31099, message: { ru: 'Уже оплачен', en: 'Already paid', uz: 'Allaqachon to\'langan' } },
  CANCEL_NOT_ALLOWED:  { code: -31007, message: { ru: 'Нельзя отменить транзакцию', en: 'Cannot cancel transaction', uz: 'Tranzaksiyani bekor qilib bo\'lmaydi' } },
} as const

function err(id: unknown, error: typeof ERRORS[keyof typeof ERRORS]) {
  return NextResponse.json({ id, error: { code: error.code, message: error.message } })
}

function ok(id: unknown, result: Record<string, unknown>) {
  return NextResponse.json({ id, result })
}

function checkAuth(request: NextRequest) {
  const auth = request.headers.get('Authorization') ?? ''
  const [, encoded] = auth.split(' ')
  if (!encoded) return false
  const decoded = Buffer.from(encoded, 'base64').toString()
  const [, password] = decoded.split(':')
  return password === process.env.PAYME_KEY
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, method, params } = body
  const db = createServiceClient()

  if (!checkAuth(request)) return err(id, ERRORS.INVALID_AUTH)

  // ── CheckPerformTransaction ─────────────────────────────────────────────────
  if (method === 'CheckPerformTransaction') {
    const paymentId = params?.account?.payment_id
    if (!paymentId) return err(id, ERRORS.ORDER_NOT_FOUND)

    const { data: payment } = await db
      .from('payments')
      .select('id, amount, status, currency')
      .eq('id', paymentId)
      .eq('provider', 'payme')
      .single() as { data: { id: string, amount: number, status: string, currency: string } | null }

    if (!payment) return err(id, ERRORS.ORDER_NOT_FOUND)
    if (payment.status === 'paid') return err(id, ERRORS.ALREADY_PAID)

    const expectedTiyin = payment.amount * 100
    if (params.amount !== expectedTiyin) return err(id, ERRORS.WRONG_AMOUNT)

    return ok(id, { allow: true })
  }

  // ── CreateTransaction ───────────────────────────────────────────────────────
  if (method === 'CreateTransaction') {
    const paymentId = params?.account?.payment_id
    const paymeTransId = params?.id
    const amount = params?.amount
    const time = params?.time

    if (!paymentId) return err(id, ERRORS.ORDER_NOT_FOUND)

    const { data: payment } = await db
      .from('payments')
      .select('id, amount, status, external_id')
      .eq('id', paymentId)
      .eq('provider', 'payme')
      .single() as { data: { id: string, amount: number, status: string, external_id: string | null } | null }

    if (!payment) return err(id, ERRORS.ORDER_NOT_FOUND)
    if (payment.status === 'paid') return err(id, ERRORS.ALREADY_PAID)

    const expectedTiyin = payment.amount * 100
    if (amount !== expectedTiyin) return err(id, ERRORS.WRONG_AMOUNT)

    // Idempotency: same payme transaction ID
    if (payment.external_id && payment.external_id !== paymeTransId) {
      return err(id, ERRORS.ALREADY_PAID)
    }

    await db
      .from('payments')
      .update({ external_id: paymeTransId, status: 'pending' } as never)
      .eq('id', paymentId)

    return ok(id, {
      create_time: time,
      transaction: paymentId,
      state: 1,
    })
  }

  // ── PerformTransaction ──────────────────────────────────────────────────────
  if (method === 'PerformTransaction') {
    const paymeTransId = params?.id

    const { data: payment } = await db
      .from('payments')
      .select('id, user_id, course_id, status, external_id')
      .eq('external_id', paymeTransId)
      .eq('provider', 'payme')
      .single() as { data: { id: string, user_id: string, course_id: string, status: string, external_id: string } | null }

    if (!payment) return err(id, ERRORS.OPERATION_NOT_FOUND)
    if (payment.status === 'failed') return err(id, ERRORS.CANCEL_NOT_ALLOWED)

    const now = Date.now()

    if (payment.status !== 'paid') {
      await db.from('payments').update({ status: 'paid' } as never).eq('id', payment.id)

      // Activate enrollment
      await db.from('enrollments').upsert({
        user_id: payment.user_id,
        course_id: payment.course_id,
        status: 'active',
        paid_at: new Date().toISOString(),
        amount: undefined,
        currency: 'UZS',
      } as never, { onConflict: 'user_id,course_id' })
    }

    return ok(id, {
      transaction: payment.id,
      perform_time: now,
      state: 2,
    })
  }

  // ── CancelTransaction ───────────────────────────────────────────────────────
  if (method === 'CancelTransaction') {
    const paymeTransId = params?.id

    const { data: payment } = await db
      .from('payments')
      .select('id, status')
      .eq('external_id', paymeTransId)
      .eq('provider', 'payme')
      .single() as { data: { id: string, status: string } | null }

    if (!payment) return err(id, ERRORS.OPERATION_NOT_FOUND)
    if (payment.status === 'paid') return err(id, ERRORS.CANCEL_NOT_ALLOWED)

    await db.from('payments').update({ status: 'failed' } as never).eq('id', payment.id)

    return ok(id, {
      transaction: payment.id,
      cancel_time: Date.now(),
      state: -1,
    })
  }

  // ── CheckTransaction ────────────────────────────────────────────────────────
  if (method === 'CheckTransaction') {
    const paymeTransId = params?.id

    const { data: payment } = await db
      .from('payments')
      .select('id, status, created_at')
      .eq('external_id', paymeTransId)
      .eq('provider', 'payme')
      .single() as { data: { id: string, status: string, created_at: string } | null }

    if (!payment) return err(id, ERRORS.OPERATION_NOT_FOUND)

    const STATE_MAP: Record<string, number> = {
      pending: 1,
      paid: 2,
      failed: -1,
      refunded: -2,
    }

    return ok(id, {
      create_time: new Date(payment.created_at).getTime(),
      perform_time: payment.status === 'paid' ? Date.now() : 0,
      cancel_time: payment.status === 'failed' ? Date.now() : 0,
      transaction: payment.id,
      state: STATE_MAP[payment.status] ?? -1,
      reason: null,
    })
  }

  return err(id, ERRORS.APP_DISABLED)
}
