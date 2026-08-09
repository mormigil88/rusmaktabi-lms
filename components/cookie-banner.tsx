'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'
export const RESET_COOKIE_EVENT = 'bilimora:reset-cookie-consent'

type ConsentValue = 'all' | 'essential' | null

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) setVisible(true)

    // Listen for global reset event (e.g. from footer "Cookie sozlamalari")
    function onReset() {
      localStorage.removeItem(COOKIE_CONSENT_KEY)
      setShowSettings(false)
      setVisible(true)
    }
    window.addEventListener(RESET_COOKIE_EVENT, onReset)
    return () => window.removeEventListener(RESET_COOKIE_EVENT, onReset)
  }, [])

  function save(value: ConsentValue) {
    if (!value) return
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ value, at: new Date().toISOString() })
    )
    setVisible(false)
    setShowSettings(false)
    // Update gtag consent state — covers GA4 + Yandex.Metrica (both use the same
    // consent API since we tag them with the same gtag config).
    if (typeof window !== 'undefined') {
      // @ts-expect-error - gtag is loaded externally
      window.gtag?.('consent', 'update', {
        analytics_storage: value === 'all' ? 'granted' : 'denied',
        ad_storage: value === 'all' ? 'granted' : 'denied',
      })
      // Meta Pixel reacts via the custom storage event in components/meta-pixel.tsx.
      // Dispatch a synthetic event so the Pixel init logic can re-run.
      window.dispatchEvent(new StorageEvent('storage', { key: COOKIE_CONSENT_KEY }))
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-brand-200 shadow-lg">
      <div className="max-w-3xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 text-sm text-brand-800">
              <p>
                <strong>Cookie-fayllar.</strong> Biz funksional va analitik
                (Google Analytics, Yandex.Metrica, Meta Pixel) cookie-fayllardan foydalanamiz.{' '}
                <Link href="/legal/cookies" className="text-brand-600 hover:underline" target="_blank">
                  Batafsil
                </Link>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 text-sm border border-brand-200 rounded-lg text-brand-700 hover:bg-brand-50 cursor-pointer"
              >
                Sozlamalar
              </button>
              <button
                onClick={() => save('essential')}
                className="px-3 py-2 text-sm border border-brand-200 rounded-lg text-brand-700 hover:bg-brand-50 cursor-pointer"
              >
                Faqat zaruriy
              </button>
              <button
                onClick={() => save('all')}
                className="px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium cursor-pointer"
              >
                Hammasi
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-brand-800">
              <p className="font-semibold mb-2">Cookie sozlamalari</p>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked disabled className="rounded" />
                  <span><strong>Funksional</strong> (majburiy) — sessiya, til, consent holati</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" id="analytics-toggle" />
                  <span><strong>Analitik</strong> — Google Analytics 4, Yandex.Metrica, Meta Pixel</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-3 py-2 text-sm border border-brand-200 rounded-lg text-brand-700 hover:bg-brand-50 cursor-pointer"
              >
                Orqaga
              </button>
              <button
                onClick={() => save('essential')}
                className="px-3 py-2 text-sm border border-brand-200 rounded-lg text-brand-700 hover:bg-brand-50 cursor-pointer"
              >
                Faqat zaruriy
              </button>
              <button
                onClick={() => save('all')}
                className="px-3 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium cursor-pointer"
              >
                Hammasi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
