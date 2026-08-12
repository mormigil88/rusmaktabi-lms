'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'

/**
 * Loads Yandex.Metrica only when the user has accepted "all" cookies. When
 * consent is "essential" or pending, neither the loader script nor the
 * <noscript> pixel runs — strictly honouring the cookie-banner promise.
 *
 * Reacts to later consent changes via the `storage` event so users can
 * upgrade "essential" → "all" and tracking begins immediately, or downgrade
 * `all` → "essential` and the next render skips the script entirely.
 */
export default function YandexMetrica({ counterId }: { counterId: number }) {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    function applyConsent(value: string | null) {
      setGranted(value === 'all')
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

    read()

    function onStorage(e: StorageEvent) {
      if (e.key === COOKIE_CONSENT_KEY) read()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  if (!granted) return null

  return (
    <>
      <Script id="ym-loader" strategy="afterInteractive">{`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
        ym(${counterId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
      `}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://mc.yandex.ru/watch/${counterId}`} style={{position:'absolute',left:'-9999px'}} alt="" />
        </div>
      </noscript>
    </>
  )
}
