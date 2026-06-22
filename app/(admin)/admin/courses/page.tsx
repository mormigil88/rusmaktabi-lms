import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { toggleCourseStatus } from '@/app/actions/admin'

type CourseRow = {
  id: string
  title: string
  slug: string
  status: string
  price_uzs: number
  price_rub: number
  created_at: string
  enrollments: { id: string }[]
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  published: { label: 'Опубликован', cls: 'bg-green-50 text-green-700' },
  draft:     { label: 'Черновик',    cls: 'bg-gray-100 text-gray-500' },
  archived:  { label: 'Архив',       cls: 'bg-red-50 text-red-400' },
}

export default async function CoursesPage() {
  const db = createServiceClient()
  const { data } = await db
    .from('courses')
    .select('id, title, slug, status, price_uzs, price_rub, created_at, enrollments(id)')
    .order('created_at', { ascending: false }) as { data: CourseRow[] | null }

  const courses = data ?? []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Курсы</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3 text-left">Название</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-right">Цена (сум)</th>
              <th className="px-6 py-3 text-right">Цена (₽)</th>
              <th className="px-6 py-3 text-right">Студентов</th>
              <th className="px-6 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Курсов пока нет</td></tr>
            )}
            {courses.map(c => {
              const meta = STATUS_META[c.status] ?? STATUS_META.draft
              return (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-400 font-mono">{c.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${meta.cls}`}>{meta.label}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 font-mono">
                    {c.price_uzs.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 font-mono">
                    {c.price_rub.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {c.enrollments?.length ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                      >
                        Редактировать
                      </Link>
                      <form action={toggleCourseStatus.bind(null, c.id, c.status)}>
                        <button
                          type="submit"
                          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {c.status === 'published' ? '→ Черновик' : '→ Опубликовать'}
                        </button>
                      </form>
                    </div>
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
