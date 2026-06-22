import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { event, object } = body

  if (event !== 'payment.succeeded') {
    return NextResponse.json({ ok: true })
  }

  const paymentDbId: string | undefined = object?.metadata?.payment_db_id
  const yookassaId: string = object?.id
  const status: string = object?.status

  if (!paymentDbId || status !== 'succeeded') {
    return NextResponse.json({ ok: true })
  }

  const db = createServiceClient()

  const { data: payment } = await db
    .from('payments')
    .select('id, user_id, course_id, status')
    .eq('id', paymentDbId)
    .eq('provider', 'yookassa')
    .single() as { data: { id: string, user_id: string, course_id: string, status: string } | null }

  if (!payment || payment.status === 'paid') {
    return NextResponse.json({ ok: true })
  }

  await db
    .from('payments')
    .update({ status: 'paid', external_id: yookassaId } as never)
    .eq('id', payment.id)

  await db
    .from('enrollments')
    .upsert({
      user_id: payment.user_id,
      course_id: payment.course_id,
      status: 'active',
      paid_at: new Date().toISOString(),
      currency: 'RUB',
    } as never, { onConflict: 'user_id,course_id' })

  return NextResponse.json({ ok: true })
}
