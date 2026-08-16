'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution, trackPageView } from '@/lib/analytics'

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'

export default function AnalyticsPageTracker() {
  const pathname = usePathname()
  const firstPage = useRef(true)

  useEffect(() => {
    captureAttribution()
    if (firstPage.current) {
      // GA config has send_page_view=false, so send the first view ourselves.
      // Metrica sends its first hit during init.
      trackPageView({ google: true, yandex: false })
      firstPage.current = false
    } else {
      // GA4 enhanced measurement observes History API navigation automatically.
      // Only Metrica and Meta need a manual SPA page-view on route changes.
      trackPageView({ google: false, yandex: true })
    }

    function onConsent(e: StorageEvent) {
      if (e.key === COOKIE_CONSENT_KEY) {
        trackPageView({ google: true, yandex: false })
      }
    }
    window.addEventListener('storage', onConsent)
    return () => window.removeEventListener('storage', onConsent)
  }, [pathname])

  return null
}
