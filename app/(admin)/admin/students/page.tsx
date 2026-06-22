import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'

type StudentRow = {
  id: string
  name: string
  email: string | null
  phone: string | null
  country: string | null
  created_at: string
  enrollments: { status: string; paid_at: string | null; courses: { title: string } | null }[]
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active:   { label: 'Активен',   cls: 'bg-green-50 text-green-700' },
  pending:  { label: 'Ожидает',   cls: 'bg-yellow-50 text-yellow-700' },
  expired:  { label: 'Истёк',     cls: 'bg-gray-100 text-gray-500' },
  refunded: { label: 'Возврат',   cls: 'bg-red-50 text-red-500' },
}

export default async function StudentsPage() {
  const db = createServiceClient()

  const { data } = await db
    .from('users')
    .select('id, name, email, phone, country, created_at, enrollments(status, paid_at, courses(title))')
    .eq('role', 'student')
    .order('created_at', { ascending: false }) as { data: StudentRow[] | null }

  const students = data ?? []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Студенты</h1>
        <span className="text-sm text-gray-400">{students.length} всего</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3 text-left">Студент</th>
              <th className="px-6 py-3 text-left">Контакт</th>
              <th className="px-6 py-3 text-left">Курс</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-right">Оплачен</th>
              <th className="px-6 py-3 text-right">Регистрация</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Студентов пока нет</td></tr>
            )}
            {students.map(s => {
              const enr = s.enrollments?.[0]
              const statusMeta = enr ? (STATUS_LABEL[enr.status] ?? STATUS_LABEL.pending) : null
              return (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(s.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{s.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-gray-600">{s.email}</div>
                    {s.phone && <div className="text-xs text-gray-400">{s.phone}</div>}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{enr?.courses?.title ?? '—'}</td>
                  <td className="px-6 py-3">
                    {statusMeta
                      ? <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${statusMeta.cls}`}>{statusMeta.label}</span>
                      : <span className="text-gray-300 text-xs">не записан</span>}
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-gray-400">
                    {enr?.paid_at ? new Date(enr.paid_at).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-gray-400">
                    {new Date(s.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
