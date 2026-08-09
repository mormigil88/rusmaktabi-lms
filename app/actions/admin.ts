'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const MAX_FILE_BYTES = 25 * 1024 * 1024 // 25 MB cap on digital-product files
const ALLOWED_MIME = new Set(['application/pdf'])

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

// ── Digital products ──────────────────────────────────────────────────────────

/**
 * Upload a PDF file for a digital_product course.
 * Deletes the previous file (if any) before uploading the new one to keep
 * the bucket clean.
 */
export async function uploadDigitalProductFile(formData: FormData) {
  const db = await requireAdmin()
  const courseId = formData.get('course_id') as string
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    throw new Error('Fayl tanlanmagan')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`Fayl juda katta (maksimum ${MAX_FILE_BYTES / 1024 / 1024} MB)`)
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Faqat PDF fayllar qabul qilinadi')
  }

  // Look up slug to namespace the storage path
  const { data: course } = await db
    .from('courses')
    .select('slug, file_path, product_type')
    .eq('id', courseId)
    .single() as { data: { slug: string; file_path: string | null; product_type: string } | null }

  if (!course || course.product_type !== 'digital_product') {
    throw new Error('Bu kurs digital product emas')
  }

  // Wipe the old file (best-effort — if it doesn't exist, ignore)
  if (course.file_path) {
    await db.storage.from('digital-products').remove([course.file_path])
  }

  // Build a deterministic storage path: <slug>/<timestamp>-<original-name>
  // Falls back to a uuid if filename is unsafe (Cyrillic, spaces, etc.)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80)
  const storagePath = `${course.slug}/${Date.now()}-${safeName || 'file.pdf'}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await db.storage
    .from('digital-products')
    .upload(storagePath, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Yuklashda xatolik: ${uploadError.message}`)
  }

  await db.from('courses').update({
    file_path: storagePath,
    // uploaded_at could be added later; we keep schema minimal for now
  } as never).eq('id', courseId)

  revalidatePath('/admin/courses')
  redirect(`/admin/courses/${courseId}`)
}

/** Remove the file attached to a digital_product without deleting the course. */
export async function deleteDigitalProductFile(formData: FormData) {
  const db = await requireAdmin()
  const courseId = formData.get('course_id') as string

  const { data: course } = await db
    .from('courses')
    .select('file_path, product_type')
    .eq('id', courseId)
    .single() as { data: { file_path: string | null; product_type: string } | null }

  if (!course || course.product_type !== 'digital_product') {
    throw new Error('Bu kurs digital product emas')
  }

  if (course.file_path) {
    await db.storage.from('digital-products').remove([course.file_path])
  }
  await db.from('courses').update({ file_path: null } as never).eq('id', courseId)

  revalidatePath('/admin/courses')
  redirect(`/admin/courses/${courseId}`)
}
