import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CompleteButton from './complete-button'
import type { Metadata } from 'next'
import type { Database } from '@/lib/supabase/types'

type Lesson = Database['public']['Tables']['lessons']['Row']
type ModuleRow = Database['public']['Tables']['modules']['Row']
type LessonMini = Pick<Lesson, 'id' | 'title' | 'order' | 'is_free' | 'duration_min'>
type ModuleWithLessons = ModuleRow & { lessons: LessonMini[] }

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }): Promise<Metadata> {
  const { slug, id } = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase
    .from('lessons').select('title').eq('id', id).single() as { data: { title: string } | null }

  return {
    title: lesson?.title ?? 'Dars',
    openGraph: {
      title: lesson ? `${lesson.title} | Rus Maktabi` : 'Rus Maktabi',
      type: 'website',
    },
  }
}

function renderMarkdown(md: string) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-foreground mt-5 mb-2">{line.slice(3)}</h2>
    if (line.startsWith('- ')) return <li key={i} className="text-sm text-brand-700/80 ml-4 list-disc">{line.slice(2)}</li>
    if (line.trim() === '') return <br key={i} />
    return <p key={i} className="text-sm text-brand-700/80 leading-relaxed">{line}</p>
  })
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single() as { data: Lesson | null }

  if (!lesson) notFound()

  // Access check for paid lessons
  if (!lesson.is_free) {
    if (!user) redirect(`/login?next=/course/${slug}/lesson/${id}`)

    const { data: mod } = await supabase
      .from('modules')
      .select('course_id')
      .eq('id', lesson.module_id)
      .single() as { data: Pick<ModuleRow, 'course_id'> | null }

    if (mod) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', mod.course_id)
        .single() as { data: Pick<Database['public']['Tables']['enrollments']['Row'], 'status'> | null }

      if (enrollment?.status !== 'active') redirect(`/course/${slug}`)
    }
  }

  // Get course_id for fetching all modules
  const { data: currentModule } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', lesson.module_id)
    .single() as { data: Pick<ModuleRow, 'course_id'> | null }

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order, lessons (id, title, order, is_free, duration_min)')
    .eq('course_id', currentModule?.course_id ?? '')
    .order('order') as { data: ModuleWithLessons[] | null }

  const allLessons: (LessonMini & { moduleTitle: string })[] = (modules ?? [])
    .sort((a, b) => a.order - b.order)
    .flatMap(m =>
      (m.lessons ?? [])
        .sort((a, b) => a.order - b.order)
        .map(l => ({ ...l, moduleTitle: m.title }))
    )

  const currentIndex = allLessons.findIndex(l => l.id === id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const completedIds = new Set<string>()
  if (user) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .in('lesson_id', allLessons.map(l => l.id)) as { data: { lesson_id: string }[] | null }
    progress?.forEach(p => completedIds.add(p.lesson_id))
  }

  const isCompleted = completedIds.has(id)

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

      {/* Main lesson area */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="border-b border-brand-100 bg-white px-4 py-3 flex items-center gap-2 text-sm">
          <Link href={`/course/${slug}`} className="text-brand-600 hover:text-brand-700 cursor-pointer transition-colors">
            ← Kursga qaytish
          </Link>
          <span className="text-brand-200">·</span>
          <span className="text-brand-700/60 truncate">{lesson.title}</span>
        </div>

        {/* Video player */}
        {lesson.video_url && (
          <div className="bg-black">
            <div className="max-w-4xl mx-auto aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${lesson.video_url}?rel=0&modestbranding=1`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Lesson content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">{lesson.title}</h1>

          {lesson.content_md && (
            <div className="mb-8 space-y-1">
              {renderMarkdown(lesson.content_md)}
            </div>
          )}

          {/* Navigation + complete */}
          <div className="flex items-center justify-between pt-6 border-t border-brand-100">
            <div>
              {prevLesson && (
                <Link
                  href={`/course/${slug}/lesson/${prevLesson.id}`}
                  className="flex items-center gap-2 text-sm text-brand-600/70 hover:text-brand-600 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Oldingi
                </Link>
              )}
            </div>

            {user ? (
              <CompleteButton
                lessonId={id}
                courseSlug={slug}
                isCompleted={isCompleted}
                nextLessonId={nextLesson?.id}
              />
            ) : (
              <Link
                href={`/register?next=/course/${slug}/lesson/${id}`}
                className="bg-cta-600 hover:bg-cta-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
              >
                Ro'yxatdan o'ting — bepul →
              </Link>
            )}

            <div>
              {nextLesson && !user && (
                <Link
                  href={`/course/${slug}/lesson/${nextLesson.id}`}
                  className="flex items-center gap-2 text-sm text-brand-600/70 hover:text-brand-600 cursor-pointer transition-colors"
                >
                  Keyingi
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-brand-100 bg-white overflow-y-auto">
        <div className="px-4 py-4 border-b border-brand-100">
          <h2 className="text-sm font-bold text-foreground">Kurs dasturi</h2>
          <p className="text-xs text-brand-600/50 mt-0.5">
            {completedIds.size}/{allLessons.length} yakunlandi
          </p>
          {allLessons.length > 0 && (
            <div className="mt-2 h-1.5 bg-brand-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedIds.size / allLessons.length) * 100)}%` }}
              />
            </div>
          )}
        </div>

        <nav className="divide-y divide-brand-50">
          {(modules ?? [])
            .sort((a, b) => a.order - b.order)
            .map(mod => (
              <div key={mod.id}>
                <div className="px-4 py-2 bg-brand-50/50">
                  <span className="text-xs font-semibold text-brand-700/60 uppercase tracking-wide">
                    {mod.title}
                  </span>
                </div>
                {(mod.lessons ?? [])
                  .sort((a, b) => a.order - b.order)
                  .map(l => {
                    const isActive = l.id === id
                    const isDone = completedIds.has(l.id)
                    const canAccess = l.is_free || !!user
                    return (
                      <div
                        key={l.id}
                        className={`px-4 py-3 flex items-center gap-2.5 ${
                          isActive ? 'bg-brand-50 border-l-2 border-brand-500' : ''
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone ? 'bg-brand-500' : isActive ? 'bg-brand-200' : 'bg-brand-50'
                        }`}>
                          {isDone ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-xs text-brand-500">{l.order}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {canAccess ? (
                            <Link
                              href={`/course/${slug}/lesson/${l.id}`}
                              className={`text-xs leading-tight block truncate cursor-pointer transition-colors ${
                                isActive ? 'font-semibold text-brand-700' : 'text-brand-700/70 hover:text-brand-600'
                              }`}
                            >
                              {l.title}
                            </Link>
                          ) : (
                            <span className="text-xs text-brand-600/30 block truncate">{l.title}</span>
                          )}
                          {l.duration_min > 0 && (
                            <span className="text-xs text-brand-600/40">{l.duration_min} min</span>
                          )}
                        </div>

                        {l.is_free && !isActive && (
                          <span className="text-xs bg-brand-100 text-brand-600 px-1 py-0.5 rounded flex-shrink-0">
                            free
                          </span>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
        </nav>
      </aside>
    </div>
  )
}
