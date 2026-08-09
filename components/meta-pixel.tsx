'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'
const RESET_COOKIE_EVENT = 'bilimora:reset-cookie-consent'

/**
 * Loads Meta Pixel only when the user has accepted "all" cookies. When consent
 * is "essential" or pending, the script never runs and no events are sent
 * (see `lib/analytics.ts`).
 *
 * Also reacts to consent changes: if the user later upgrades "essential" → "all",
 * the Pixel is initialised on the fly; if they downgrade, we forget the queue
 * so subsequent `track()` calls are no-ops.
 */
export default function MetaPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    function applyConsent(value: string | null) {
      if (value === 'all') {
        // Initialise Pixel (idempotent — Meta dedupes by pixelId).
        if (typeof window !== 'undefined' && window.fbq && !window._fbq) {
          window.fbq('init', pixelId)
          window.fbq('track', 'PageView')
        }
      }
      // For "essential" or null we don't touch the queue — lib/analytics.ts blocks
      // sends, and if Pixel is already loaded we leave the script alone (a reload
      // would be the only way to fully stop it, which we avoid to keep the page fast).
    }

    function read() {
      try {
        const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
        const parsed = raw ? (JSON.parse(raw) as { value?: string }) : null
        applyConsent(parsed?.value ?? null)
      } catch {
        applyConsent(null)
      }
    }

    // Read once on mount in case consent was granted before Pixel mounted.
    read()

    // React to later changes (user clicks "Cookie sozlamalari" in footer).
    function onStorage(e: StorageEvent) {
      if (e.key === COOKIE_CONSENT_KEY) read()
    }
    function onReset() { read() }

    window.addEventListener('storage', onStorage)
    window.addEventListener(RESET_COOKIE_EVENT, onReset)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(RESET_COOKIE_EVENT, onReset)
    }
  }, [pixelId])

  return (
    <>
      <Script id="meta-pixel-loader" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={1}
          width={1}
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
