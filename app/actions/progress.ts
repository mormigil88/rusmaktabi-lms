'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await supabase
    .from('lesson_progress')
    .upsert({ user_id: user.id, lesson_id: lessonId } as never, { onConflict: 'user_id,lesson_id' })

  revalidatePath(`/course/${courseSlug}/lesson/${lessonId}`)
  return { ok: true }
}
