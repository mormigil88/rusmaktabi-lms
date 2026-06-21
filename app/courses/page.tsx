import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false }) as { data: Course[] | null }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kurslar</h1>
      <p className="text-gray-500 mb-10">Rus tilini o'rganing — Rossiya maktabiga tayyor bo'ling</p>

      {(!courses || courses.length === 0) ? (
        <p className="text-gray-400">Hozircha kurslar yo'q. Tez orada!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <a
              key={course.id}
              href={`/course/${course.slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group"
            >
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
              )}
              <div className="p-5">
                <h2 className="font-bold text-gray-900 group-hover:text-brand-600 transition">{course.title}</h2>
                {course.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-brand-600 font-bold">
                    {course.price_uzs > 0
                      ? `${course.price_uzs.toLocaleString()} so'm`
                      : 'Bepul'}
                  </span>
                  <span className="text-xs text-gray-400 uppercase">{course.language}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
