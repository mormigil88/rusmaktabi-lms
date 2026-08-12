'use client'

import { useState, useTransition } from 'react'
import {
  grantMarketingConsent,
  revokeMarketingConsent,
} from '@/app/actions/consent'

type Props = {
  initialGranted: boolean
  grantedAt: string | null
  revokedAt: string | null
}

export default function MarketingConsentToggle({
  initialGranted,
  grantedAt,
  revokedAt,
}: Props) {
  const [granted, setGranted] = useState(initialGranted)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function toggle() {
    setError('')
    startTransition(async () => {
      try {
        if (granted) {
          await revokeMarketingConsent()
          setGranted(false)
        } else {
          await grantMarketingConsent()
          setGranted(true)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Xatolik yuz berdi')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <input
          id="marketing-toggle"
          type="checkbox"
          checked={granted}
          onChange={toggle}
          disabled={pending}
          className="mt-1 w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-500 cursor-pointer disabled:opacity-50 flex-shrink-0"
        />
        <label
          htmlFor="marketing-toggle"
          className="text-sm text-brand-800 leading-relaxed cursor-pointer"
        >
          Bilimora'dan foydali materiallar, yangi kurslar va chegirmalar
          haqida <strong>email orqali xabar olishga roziman</strong>.
        </label>
      </div>

      <div className="text-xs text-brand-600/60 space-y-0.5">
        {granted && grantedAt && (
          <p>Rozilik berilgan: {new Date(grantedAt).toLocaleString('uz-UZ')}</p>
        )}
        {!granted && revokedAt && (
          <p>Rozilik qaytarib olingan: {new Date(revokedAt).toLocaleString('uz-UZ')}</p>
        )}
        {pending && <p className="text-brand-600">Saqlanmoqda…</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  )
}
