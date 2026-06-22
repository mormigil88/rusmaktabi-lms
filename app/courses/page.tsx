export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/navbar'
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
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Kurslar</h1>
          <p className="text-brand-700/60">Rus tilini o'rganing — Rossiya maktabiga tayyor bo'ling</p>
        </div>

        {(!courses || courses.length === 0) ? (
          <div className="bg-white rounded-2xl border border-brand-100 p-16 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-brand-700/50 mb-2">Hozircha kurslar yo'q</p>
            <p className="text-sm text-brand-600/40">Tez orada rus tili intensiv kursi qo'shiladi</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <Link
                key={course.id}
                href={`/course/${course.slug}`}
                className="bg-white rounded-2xl border border-brand-100 overflow-hidden hover:shadow-md hover:border-brand-200 transition-all duration-200 cursor-pointer group"
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-bold text-foreground group-hover:text-brand-600 transition-colors duration-150 leading-tight">
                    {course.title}
                  </h2>
                  {course.description && (
                    <p className="text-sm text-brand-700/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-brand-600 font-bold">
                      {course.price_uzs > 0
                        ? `${course.price_uzs.toLocaleString()} so'm`
                        : 'Bepul'}
                    </span>
                    <span className="text-xs text-brand-600/40 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {course.language === 'ru' ? 'Rus tili' : course.language}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
