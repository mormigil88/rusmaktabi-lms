import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckoutForm from './checkout-form'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/course/${slug}/checkout`)

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: Course | null }

  if (!course) notFound()

  // Already enrolled → go to course
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single() as { data: { status: string } | null }

  if (enrollment?.status === 'active') redirect(`/course/${slug}`)

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">To'lov</h1>
        <p className="text-brand-700/60 text-sm">To'lov tizimini tanlang</p>
      </div>

      {/* Course summary */}
      <div className="bg-brand-50 rounded-2xl border border-brand-100 p-5 mb-6">
        <div className="text-xs text-brand-600/50 uppercase tracking-wide mb-1">Kurs</div>
        <div className="font-semibold text-foreground">{course.title}</div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-100">
          <div className="text-sm text-brand-700/60">To'liq kurs, umrbod kirish</div>
          <div className="text-right">
            <div className="font-bold text-foreground">
              {(course.price_uzs / 1000).toFixed(0)}k so'm
            </div>
            {course.price_rub > 0 && (
              <div className="text-xs text-brand-600/50">
                {course.price_rub.toLocaleString()} ₽
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutForm
        courseId={course.id}
        courseSlug={slug}
        courseTitle={course.title}
        priceUzs={course.price_uzs}
        priceRub={course.price_rub}
        userId={user.id}
      />

      <p className="text-center text-xs text-brand-600/40 mt-6">
        Natija bo'lmasa 7 kun ichida to'liq qaytaramiz
      </p>
    </div>
  )
}
