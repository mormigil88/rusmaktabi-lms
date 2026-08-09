'use client'

import { useState } from 'react'

type DownloadState = 'idle' | 'loading' | 'error'

interface Props {
  slug: string
  /** When false, the file hasn't been uploaded yet — show "coming soon" instead of a button. */
  ready: boolean
}

/**
 * Calls POST /api/download/[slug] (server checks enrollment, returns signed URL),
 * then redirects the browser to the signed URL — Supabase Storage 302s to the actual file.
 *
 * The signed URL is short-lived (5 min) and only works for an authenticated buyer
 * with an active enrollment. Sharing the URL does nothing for anyone else.
 */
export default function DownloadButton({ slug, ready }: Props) {
  const [state, setState] = useState<DownloadState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!ready) {
    return (
      <div className="bg-brand-50 text-brand-700/60 text-sm font-medium py-3 rounded-xl text-center select-none">
        Fayl tayyorlanmoqda — tez orada yuklab olishingiz mumkin
      </div>
    )
  }

  async function handleClick() {
    setState('loading')
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/download/${slug}`, { method: 'GET' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'unknown' }))
        const msg =
          data.error === 'auth_required' ? 'Tizimga kiring' :
          data.error === 'enrollment_required' ? 'Avval xarid qiling' :
          data.error === 'file_not_ready' ? 'Fayl hozircha tayyor emas' :
          data.error === 'storage_error' ? 'Serverda xatolik, keyinroq urinib ko\'ring' :
          'Yuklab olishning imkoni yo\'q'
        setErrorMsg(msg)
        setState('error')
        return
      }
      const { url } = await res.json()
      window.location.href = url
    } catch {
      setErrorMsg('Tarmoq xatosi')
      setState('error')
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'loading'}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-wait"
      >
        {state === 'loading' ? 'Tayyorlanmoqda…' : 'Yuklab olish →'}
      </button>
      <p className="text-xs text-brand-600/50 text-center">
        Havola 5 daqiqaga beriladi — boshqalar bilan ulashib bo'lmaydi
      </p>
      {state === 'error' && errorMsg && (
        <p className="text-xs text-red-600 text-center">{errorMsg}</p>
      )}
    </div>
  )
}
