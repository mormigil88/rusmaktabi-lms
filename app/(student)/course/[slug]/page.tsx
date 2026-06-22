import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']
type LessonPreview = Pick<Database['public']['Tables']['lessons']['Row'], 'id' | 'title' | 'duration_min' | 'order' | 'is_free' | 'video_url'>
type ModuleWithLessons = Database['public']['Tables']['modules']['Row'] & { lessons: LessonPreview[] }
type Enrollment = Pick<Database['public']['Tables']['enrollments']['Row'], 'id' | 'status'>

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses').select('title, description').eq('slug', slug).single() as { data: Pick<Course, 'title' | 'description'> | null }

  if (!course) return { title: 'Kurs topilmadi' }

  return {
    title: course.title,
    description: course.description ?? "Bolangizni Rossiya maktabiga 4 haftada tayyorlaymiz.",
    openGraph: {
      title: `${course.title} | Rus Maktabi`,
      description: course.description ?? "Bolangizni Rossiya maktabiga 4 haftada tayyorlaymiz.",
      type: 'website',
    },
  }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: Course | null }

  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order, lessons (id, title, duration_min, order, is_free, video_url)')
    .eq('course_id', course.id)
    .order('order') as { data: ModuleWithLessons[] | null }

  const { data: enrollment } = user
    ? await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single() as { data: Enrollment | null }
    : { data: null }

  const isEnrolled = enrollment?.status === 'active'

  const totalLessons = (modules ?? []).reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0)
  const totalMinutes = (modules ?? []).reduce(
    (sum, m) => sum + (m.lessons ?? []).reduce((s, l) => s + (l.duration_min ?? 0), 0),
    0
  )
  const firstFreeLesson = (modules ?? [])
    .flatMap(m => m.lessons ?? [])
    .find(l => l.is_free)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-28 sm:pb-10">
      {/* Sticky mobile CTA — appears only on small screens */}
      {!isEnrolled && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-brand-100 px-4 py-3 flex items-center justify-between z-40 shadow-lg">
          <div>
            <div className="font-bold text-foreground text-sm">
              {course.price_uzs > 0 ? `${(course.price_uzs / 1000).toFixed(0)}k so'm` : 'Bepul'}
            </div>
            {course.price_rub > 0 && (
              <div className="text-xs text-brand-600/50">{course.price_rub.toLocaleString()} ₽</div>
            )}
          </div>
          <Link
            href={user ? `/course/${slug}/checkout` : '/register'}
            className="bg-cta-600 hover:bg-cta-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
          >
            {user ? 'Sotib olish →' : "Ro'yxat →"}
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-8">

        {/* Main content */}
        <div className="sm:col-span-2 space-y-8">

          {/* Hero */}
          <div>
            <span className="inline-block text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full mb-4">
              {course.language === 'ru' ? 'Rus tili' : course.language}
            </span>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-brand-700/70 leading-relaxed">{course.description}</p>
            )}

            {/* Stats row */}
            <div className="flex gap-6 mt-6 pt-6 border-t border-brand-100">
              <div className="text-center">
                <div className="text-xl font-bold text-brand-700">{(modules ?? []).length}</div>
                <div className="text-xs text-brand-600/50 mt-0.5">Modul</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-brand-700">{totalLessons}</div>
                <div className="text-xs text-brand-600/50 mt-0.5">Dars</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-brand-700">{Math.round(totalMinutes / 60)}+ soat</div>
                <div className="text-xs text-brand-600/50 mt-0.5">Umumiy</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-brand-700">4 hafta</div>
                <div className="text-xs text-brand-600/50 mt-0.5">Davomiyligi</div>
              </div>
            </div>
          </div>

          {/* Modules & Lessons */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Kurs dasturi</h2>
            <div className="space-y-3">
              {(modules ?? []).map(mod => (
                <div key={mod.id} className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-sm">{mod.title}</h3>
                    <span className="text-xs text-brand-600/50">{mod.lessons?.length ?? 0} dars</span>
                  </div>
                  <div className="border-t border-brand-50">
                    {(mod.lessons ?? [])
                      .sort((a, b) => a.order - b.order)
                      .map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="px-5 py-3 flex items-center gap-3 border-b border-brand-50 last:border-0"
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            lesson.is_free || isEnrolled ? 'bg-brand-50' : 'bg-gray-50'
                          }`}>
                            {lesson.is_free || isEnrolled ? (
                              <svg className="w-3.5 h-3.5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {lesson.is_free || isEnrolled ? (
                              <Link
                                href={`/course/${slug}/lesson/${lesson.id}`}
                                className="text-sm text-foreground hover:text-brand-600 transition-colors font-medium cursor-pointer"
                              >
                                {idx + 1}. {lesson.title}
                              </Link>
                            ) : (
                              <span className="text-sm text-brand-700/40">{idx + 1}. {lesson.title}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {lesson.is_free && (
                              <span className="text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-medium">
                                Bepul
                              </span>
                            )}
                            {lesson.duration_min > 0 && (
                              <span className="text-xs text-brand-600/40">{lesson.duration_min} min</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky price card */}
        <aside className="sm:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
            {isEnrolled ? (
              <>
                <div className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Faol kurs
                </div>
                <p className="text-sm text-brand-700/60 mb-5">Kursga yozilgansiz. Davom etishingiz mumkin.</p>
                {firstFreeLesson && (
                  <Link
                    href={`/course/${slug}/lesson/${firstFreeLesson.id}`}
                    className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl text-center transition-colors duration-200 cursor-pointer"
                  >
                    Davom etish →
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-foreground">
                    {course.price_uzs > 0
                      ? `${(course.price_uzs / 1000).toFixed(0)}k so'm`
                      : 'Bepul'}
                  </span>
                </div>
                {course.price_rub > 0 && (
                  <div className="text-sm text-brand-600/50 mb-5">
                    yoki {course.price_rub.toLocaleString()} ₽
                  </div>
                )}

                <div className="space-y-2.5 mb-5 text-sm text-brand-700/70">
                  {[
                    '4 haftalik intensiv',
                    'Individual dastur',
                    'Natija kafolati',
                    'Umrbod kirish imkoniyati',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                <Link
                  href={user ? `/course/${slug}/checkout` : '/register'}
                  className="block w-full bg-cta-600 hover:bg-cta-700 text-white font-semibold py-3 rounded-xl text-center transition-colors duration-200 cursor-pointer mb-3"
                >
                  {user ? 'Sotib olish →' : "Ro'yxatdan o'tish →"}
                </Link>

                {firstFreeLesson && (
                  <Link
                    href={`/course/${slug}/lesson/${firstFreeLesson.id}`}
                    className="block w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-2.5 rounded-xl text-center text-sm transition-colors duration-200 cursor-pointer"
                  >
                    Bepul darsni ko'rish
                  </Link>
                )}

                <p className="text-center text-xs text-brand-600/40 mt-4">
                  Pul kafolati — 7 kun ichida
                </p>
              </>
            )}
          </div>
        </aside>

      </div>
    </div>
  )
}
