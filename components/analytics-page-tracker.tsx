'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution, trackPageView } from '@/lib/analytics'

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'

export default function AnalyticsPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    captureAttribution()
    trackPageView()

    function onConsent(e: StorageEvent) {
      if (e.key === COOKIE_CONSENT_KEY) trackPageView()
    }
    window.addEventListener('storage', onConsent)
    return () => window.removeEventListener('storage', onConsent)
  }, [pathname])

  return null
}
