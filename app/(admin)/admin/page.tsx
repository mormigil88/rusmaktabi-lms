import { createServiceClient } from '@/lib/supabase/service'

type StatCard = { label: string; value: string; sub?: string; color: string }

export default async function AdminOverviewPage() {
  const db = createServiceClient()

  const [paymentsRes, enrollmentsRes, usersRes, coursesRes, recentRes] = await Promise.all([
    db.from('payments').select('amount, currency, status').eq('status', 'paid'),
    db.from('enrollments').select('id, status'),
    db.from('users').select('id, role'),
    db.from('courses').select('id, title, status'),
    db.from('payments')
      .select('id, amount, currency, created_at, users(name, email), courses(title)')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(7) as unknown as { data: RecentPayment[] | null },
  ])

  type RecentPayment = {
    id: string
    amount: number
    currency: string
    created_at: string
    users: { name: string; email: string } | null
    courses: { title: string } | null
  }

  const payments = (paymentsRes.data ?? []) as { amount: number; currency: string; status: string }[]
  const enrollments = (enrollmentsRes.data ?? []) as { id: string; status: string }[]
  const users = (usersRes.data ?? []) as { id: string; role: string }[]
  const courses = (coursesRes.data ?? []) as { id: string; title: string; status: string }[]
  const recent = (recentRes.data ?? []) as RecentPayment[]

  const totalUzs = payments.filter(p => p.currency === 'UZS').reduce((s, p) => s + p.amount, 0)
  const totalRub = payments.filter(p => p.currency === 'RUB').reduce((s, p) => s + p.amount, 0)
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length
  const studentCount = users.filter(u => u.role === 'student').length

  const stats: StatCard[] = [
    { label: 'Выручка (сум)', value: totalUzs.toLocaleString('ru-RU') + ' сум', sub: 'Payme, оплачено', color: 'bg-teal-50 text-teal-700' },
    { label: 'Выручка (₽)', value: totalRub.toLocaleString('ru-RU') + ' ₽', sub: 'YooKassa, оплачено', color: 'bg-blue-50 text-blue-700' },
    { label: 'Студентов', value: String(studentCount), sub: `${activeEnrollments} зачислены`, color: 'bg-purple-50 text-purple-700' },
    { label: 'Курсов', value: String(courses.length), sub: `${courses.filter(c => c.status === 'published').length} опубликовано`, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Обзор</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-block text-xs font-medium px-2 py-0.5 rounded mb-3 ${s.color}`}>{s.label}</div>
            <div className="text-2xl font-bold text-gray-900 leading-tight">{s.value}</div>
            {s.sub && <div className="text-xs text-gray-400 mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Последние платежи</h2>
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
            {recent.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Платежей пока нет</td></tr>
            )}
            {recent.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                <td className="px-6 py-3">
                  <div className="font-medium text-gray-900">{p.users?.name || '—'}</div>
                  <div className="text-xs text-gray-400">{p.users?.email}</div>
                </td>
                <td className="px-6 py-3 text-gray-600">{p.courses?.title || '—'}</td>
                <td className="px-6 py-3 text-right font-mono text-gray-900">
                  {p.amount.toLocaleString('ru-RU')} {p.currency}
                </td>
                <td className="px-6 py-3 text-right text-gray-400 text-xs">
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
