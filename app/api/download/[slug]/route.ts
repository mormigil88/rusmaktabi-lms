import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']
type Enrollment = Database['public']['Tables']['enrollments']['Row']

const SIGNED_URL_TTL_SECONDS = 300 // 5 minutes — enough to download, not enough to share

/**
 * GET /api/download/[slug]
 *
 * Mints a short-lived signed URL for the digital product's file.
 * Returns 402 if the user has an active enrollment but no file attached yet
 * (so the admin can see "buyer paid, file not yet uploaded" in logs).
 * Returns 403 for any other case (no auth, no enrollment, wrong status).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // 1. Authenticated user required
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  // 2. Find the course (must be published, must be a digital product)
  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, product_type, file_path, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: Pick<Course, 'id' | 'slug' | 'product_type' | 'file_path' | 'status'> | null }

  if (!course || course.product_type !== 'digital_product') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // 3. Verify active enrollment for this user
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single() as { data: Pick<Enrollment, 'status'> | null }

  if (enrollment?.status !== 'active') {
    return NextResponse.json({ error: 'enrollment_required' }, { status: 403 })
  }

  // 4. No file uploaded yet — tell the buyer honestly, log fault to admin
  if (!course.file_path) {
    return NextResponse.json(
      { error: 'file_not_ready', message: 'Файл ещё не загружен администратором.' },
      { status: 402 }
    )
  }

  // 5. Mint signed URL via service_role (bypasses RLS on storage.objects)
  const db = createServiceClient()
  const { data: signed, error } = await db
    .storage
    .from('digital-products')
    .createSignedUrl(course.file_path, SIGNED_URL_TTL_SECONDS)

  if (error || !signed) {
    console.error('signed_url_error', { slug, file_path: course.file_path, error })
    return NextResponse.json({ error: 'storage_error' }, { status: 500 })
  }

  return NextResponse.json({
    url: signed.signedUrl,
    expires_in: SIGNED_URL_TTL_SECONDS,
    filename: course.file_path.split('/').pop(),
  })
}
