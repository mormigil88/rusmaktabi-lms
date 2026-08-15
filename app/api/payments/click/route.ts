import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

// Click Shop API error codes (negative = error)
const ERR = {
  SUCCESS:           { code: 0,  note: 'Success' },
  SIGN_CHECK_FAILED: { code: -1, note: 'SIGN CHECK FAILED' },
  INVALID_ACTION:    { code: -2, note: 'Invalid action' },
  INVALID_AMOUNT:    { code: -3, note: 'Invalid amount' },
  ALREADY_PAID:      { code: -4, note: 'Already paid' },
  USER_NOT_FOUND:    { code: -5, note: 'User does not exist' },
  TX_NOT_FOUND:      { code: -9, note: 'Transaction does not exist' },
  TX_CANCELLED:      { code: -6, note: 'Transaction cancelled' },
  TX_NOT_ALLOWED:    { code: -8, note: 'Transaction not allowed' },
} as const

function respond(
  data: Record<string, unknown>,
  error: { code: number; note: string } = ERR.SUCCESS,
) {
  return NextResponse.json({ error: error.code, error_note: error.note, ...data })
}

// sign_string для Prepare/Complete webhook:
//   md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
// merchant_prepare_id пуст в Prepare, заполнен в Complete.
// Источник: github.com/samarbadriddin0v/click-uz-integration-nodejs (utils/click-check.js).
function verifySign(params: Record<string, string>, provided: string): boolean {
  const SECRET = process.env.CLICK_SECRET_KEY ?? ''
  const md5 = crypto.createHash('md5')
  md5.update(
    String(params.click_trans_id ?? '') +
      String(params.service_id ?? '') +
      SECRET +
      String(params.merchant_trans_id ?? '') +
      String(params.merchant_prepare_id ?? '') +
      String(params.amount ?? '') +
      String(params.action ?? '') +
      String(params.sign_time ?? ''),
  )
  return md5.digest('hex') === provided
}

export async function POST(request: NextRequest) {
  // Click шлёт application/x-www-form-urlencoded, не JSON
  const form = await request.formData()
  const params: Record<string, string> = {}
  for (const [k, v] of form.entries()) params[k] = String(v)

  const {
    click_trans_id,
    service_id,
    merchant_trans_id, // our payment.id (UUID)
    amount,
    action,
    sign_time,
    sign_string,
    error: incomingError,
  } = params

  if (!sign_string || !verifySign(params, sign_string)) {
    return respond({ click_trans_id }, ERR.SIGN_CHECK_FAILED)
  }

  if (!merchant_trans_id) {
    return respond({ click_trans_id }, ERR.USER_NOT_FOUND)
  }

  const db = createServiceClient()
  const { data: payment } = await db
    .from('payments')
    .select('id, user_id, course_id, amount, status, external_id')
    .eq('id', merchant_trans_id)
    .eq('provider', 'click')
    .single() as {
    data: {
      id: string
      user_id: string
      course_id: string
      amount: number
      status: string
      external_id: string | null
    } | null
  }

  if (!payment) {
    return respond({ click_trans_id }, ERR.USER_NOT_FOUND)
  }

  // ── Prepare (action=0) ─────────────────────────────────────────────────
  // Click спрашивает: "можно ли провести платёж?"
  if (action === '0') {
    if (payment.status === 'paid') {
      return respond(
        { click_trans_id, merchant_trans_id: payment.id },
        ERR.ALREADY_PAID,
      )
    }
    if (Number(amount) !== payment.amount) {
      return respond(
        { click_trans_id, merchant_trans_id: payment.id },
        ERR.INVALID_AMOUNT,
      )
    }

    // Фиксируем click_trans_id (идемпотентность)
    await db
      .from('payments')
      .update({ external_id: click_trans_id, status: 'pending' } as never)
      .eq('id', payment.id)

    return respond({
      click_trans_id,
      merchant_trans_id: payment.id,
      merchant_prepare_id: payment.id,
    })
  }

  // ── Complete (action=1) ────────────────────────────────────────────────
  // Click подтверждает: "деньги списались, активируй заказ"
  if (action === '1') {
    if (payment.external_id && payment.external_id !== click_trans_id) {
      return respond(
        { click_trans_id, merchant_trans_id: payment.id },
        ERR.TX_NOT_ALLOWED,
      )
    }

    // Если платёж ещё не был отменён/неуспешен — активируем
    if (payment.status !== 'paid') {
      await db
        .from('payments')
        .update({ status: 'paid', external_id: click_trans_id } as never)
        .eq('id', payment.id)

      await db.from('enrollments').upsert(
        {
          user_id: payment.user_id,
          course_id: payment.course_id,
          status: 'active',
          paid_at: new Date().toISOString(),
          amount: undefined,
          currency: 'UZS',
        } as never,
        { onConflict: 'user_id,course_id' },
      )
    }

    return respond({
      click_trans_id,
      merchant_trans_id: payment.id,
      merchant_confirm_id: payment.id,
    })
  }

  return respond({ click_trans_id }, ERR.INVALID_ACTION)
}
