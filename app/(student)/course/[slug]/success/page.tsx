import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', slug)
    .single() as { data: Pick<Course, 'id' | 'title' | 'slug'> | null }

  if (!course) notFound()

  // Get first lesson to link directly
  const { data: firstModule } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', course.id)
    .order('order')
    .limit(1)
    .single() as { data: { id: string } | null }

  const { data: firstLesson } = firstModule
    ? await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', firstModule.id)
        .order('order')
        .limit(1)
        .single() as { data: { id: string } | null }
    : { data: null }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">
        To'lov muvaffaqiyatli!
      </h1>
      <p className="text-brand-700/60 mb-2">
        <span className="font-medium text-foreground">{course.title}</span> kursiga yozildingiz.
      </p>
      <p className="text-sm text-brand-600/50 mb-10">
        Hoziroq birinchi darsni boshlashingiz mumkin.
      </p>

      <div className="space-y-3">
        {firstLesson ? (
          <Link
            href={`/course/${slug}/lesson/${firstLesson.id}`}
            className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors duration-200 cursor-pointer"
          >
            Birinchi darsni boshlash →
          </Link>
        ) : (
          <Link
            href={`/course/${slug}`}
            className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors duration-200 cursor-pointer"
          >
            Kursga o'tish →
          </Link>
        )}

        <Link
          href="/dashboard"
          className="block w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-3 rounded-2xl text-sm transition-colors duration-200 cursor-pointer"
        >
          Shaxsiy kabinetga
        </Link>
      </div>

      <div className="mt-10 pt-6 border-t border-brand-100 text-xs text-brand-600/40">
        To'lov tasdiqnomasini emailga yubordik.
        Savollar bo'lsa — Telegram kanalimizga yozing.
      </div>
    </div>
  )
}
