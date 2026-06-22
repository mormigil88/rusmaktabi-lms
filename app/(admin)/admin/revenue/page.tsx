import { createServiceClient } from '@/lib/supabase/service'

type Payment = {
  id: string
  amount: number
  currency: string
  created_at: string
  users: { name: string; email: string } | null
  courses: { title: string } | null
}

type DayRow = {
  day: string
  uzs: number
  rub: number
}

export default async function RevenuePage() {
  const db = createServiceClient()

  const { data } = await db
    .from('payments')
    .select('id, amount, currency, created_at, users(name, email), courses(title)')
    .eq('status', 'paid')
    .order('created_at', { ascending: false }) as { data: Payment[] | null }

  const payments = data ?? []

  const totalUzs = payments.filter(p => p.currency === 'UZS').reduce((s, p) => s + p.amount, 0)
  const totalRub = payments.filter(p => p.currency === 'RUB').reduce((s, p) => s + p.amount, 0)

  // Group by day
  const dayMap: Record<string, DayRow> = {}
  for (const p of payments) {
    const day = p.created_at.slice(0, 10)
    if (!dayMap[day]) dayMap[day] = { day, uzs: 0, rub: 0 }
    if (p.currency === 'UZS') dayMap[day].uzs += p.amount
    if (p.currency === 'RUB') dayMap[day].rub += p.amount
  }
  const days = Object.values(dayMap).sort((a, b) => b.day.localeCompare(a.day)).slice(0, 30)

  const maxUzs = Math.max(...days.map(d => d.uzs), 1)
  const maxRub = Math.max(...days.map(d => d.rub), 1)

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Выручка</h1>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-xs text-gray-400 mb-2">Итого (UZS)</div>
          <div className="text-3xl font-bold text-teal-700">{totalUzs.toLocaleString('ru-RU')}</div>
          <div className="text-sm text-gray-400 mt-1">сум · Payme</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-xs text-gray-400 mb-2">Итого (RUB)</div>
          <div className="text-3xl font-bold text-blue-700">{totalRub.toLocaleString('ru-RU')}</div>
          <div className="text-sm text-gray-400 mt-1">₽ · YooKassa</div>
        </div>
      </div>

      {/* Bar chart by day */}
      {days.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">По дням (последние 30)</h2>
          <div className="space-y-2">
            {days.map(d => (
              <div key={d.day} className="flex items-center gap-3 text-xs">
                <span className="w-20 text-gray-400 flex-shrink-0">{d.day.slice(5)}</span>
                <div className="flex-1 flex flex-col gap-1">
                  {d.uzs > 0 && (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 bg-teal-400 rounded-sm"
                        style={{ width: `${(d.uzs / maxUzs) * 100}%`, minWidth: '4px' }}
                      />
                      <span className="text-gray-500">{d.uzs.toLocaleString('ru-RU')} сум</span>
                    </div>
                  )}
                  {d.rub > 0 && (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 bg-blue-400 rounded-sm"
                        style={{ width: `${(d.rub / maxRub) * 100}%`, minWidth: '4px' }}
                      />
                      <span className="text-gray-500">{d.rub.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All payments table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Все платежи ({payments.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3 text-left">Студент</th>
              <th className="px-6 py-3 text-left">Курс</th>
              <th className="px-6 py-3 text-right">Сумма</th>
              <th className="px-6 py-3 text-right">Дата</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Платежей пока нет</td></tr>
            )}
            {payments.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                <td className="px-6 py-3">
                  <div className="font-medium text-gray-900">{p.users?.name || '—'}</div>
                  <div className="text-xs text-gray-400">{p.users?.email}</div>
                </td>
                <td className="px-6 py-3 text-gray-600">{p.courses?.title || '—'}</td>
                <td className="px-6 py-3 text-right font-mono font-medium text-gray-900">
                  {p.amount.toLocaleString('ru-RU')} {p.currency}
                </td>
                <td className="px-6 py-3 text-right text-xs text-gray-400">
                  {new Date(p.created_at).toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
