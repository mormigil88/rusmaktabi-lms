'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single() as { data: { role: string } | null }
  if (profile?.role !== 'admin') throw new Error('Not authorized')
  return createServiceClient()
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function toggleCourseStatus(courseId: string, currentStatus: string) {
  const db = await requireAdmin()
  const next = currentStatus === 'published' ? 'draft' : 'published'
  await db.from('courses').update({ status: next } as never).eq('id', courseId)
  revalidatePath('/admin/courses')
}

export async function updateCourse(formData: FormData) {
  const db = await requireAdmin()
  const id = formData.get('id') as string
  await db.from('courses').update({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price_uzs: Number(formData.get('price_uzs')),
    price_rub: Number(formData.get('price_rub')),
  } as never).eq('id', id)
  revalidatePath('/admin/courses')
  redirect('/admin/courses')
}

// ── Lessons ───────────────────────────────────────────────────────────────────

export async function updateLesson(formData: FormData) {
  const db = await requireAdmin()
  const id = formData.get('id') as string
  await db.from('lessons').update({
    title: formData.get('title') as string,
    video_url: formData.get('video_url') as string,
    content_md: formData.get('content_md') as string,
    is_free: formData.get('is_free') === 'true',
    duration_min: Number(formData.get('duration_min')) || 0,
  } as never).eq('id', id)
  revalidatePath('/admin/courses')
  const courseId = formData.get('course_id') as string
  redirect(`/admin/courses/${courseId}`)
}

export async function addLesson(formData: FormData) {
  const db = await requireAdmin()
  const moduleId = formData.get('module_id') as string
  const courseId = formData.get('course_id') as string

  const { data: existing } = await db
    .from('lessons').select('order').eq('module_id', moduleId).order('order', { ascending: false }).limit(1)
  const nextOrder = ((existing?.[0] as { order: number } | undefined)?.order ?? 0) + 1

  await db.from('lessons').insert({
    module_id: moduleId,
    title: formData.get('title') as string,
    video_url: formData.get('video_url') as string || null,
    content_md: null,
    is_free: formData.get('is_free') === 'true',
    duration_min: Number(formData.get('duration_min')) || 0,
    order: nextOrder,
    video_provider: 'youtube',
  } as never)

  revalidatePath('/admin/courses')
  redirect(`/admin/courses/${courseId}`)
}

export async function addModule(formData: FormData) {
  const db = await requireAdmin()
  const courseId = formData.get('course_id') as string

  const { data: existing } = await db
    .from('modules').select('order').eq('course_id', courseId).order('order', { ascending: false }).limit(1)
  const nextOrder = ((existing?.[0] as { order: number } | undefined)?.order ?? 0) + 1

  await db.from('modules').insert({
    course_id: courseId,
    title: formData.get('title') as string,
    order: nextOrder,
  } as never)

  revalidatePath('/admin/courses')
  redirect(`/admin/courses/${courseId}`)
}
