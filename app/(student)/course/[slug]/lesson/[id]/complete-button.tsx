'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markLessonComplete } from '@/app/actions/progress'

interface CompleteButtonProps {
  lessonId: string
  courseSlug: string
  isCompleted: boolean
  nextLessonId?: string
}

export default function CompleteButton({ lessonId, courseSlug, isCompleted, nextLessonId }: CompleteButtonProps) {
  const router = useRouter()
  const [done, setDone] = useState(isCompleted)
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (done) {
      if (nextLessonId) router.push(`/course/${courseSlug}/lesson/${nextLessonId}`)
      return
    }

    setLoading(true)
    await markLessonComplete(lessonId, courseSlug)
    setDone(true)
    setLoading(false)

    if (nextLessonId) {
      setTimeout(() => router.push(`/course/${courseSlug}/lesson/${nextLessonId}`), 600)
    }
  }

  if (done) {
    return (
      <button
        onClick={handleComplete}
        className="flex items-center gap-2 bg-brand-50 text-brand-700 font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
      >
        <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {nextLessonId ? 'Keyingi dars →' : 'Bajarildi'}
      </button>
    )
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Saqlanmoqda...
        </>
      ) : (
        'Darsni yakunlash ✓'
      )}
    </button>
  )
}
