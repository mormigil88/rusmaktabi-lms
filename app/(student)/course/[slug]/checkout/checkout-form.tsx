'use client'

import { useState } from 'react'
import { initiatePayme, initiateYooKassa } from '@/app/actions/payments'

interface CheckoutFormProps {
  courseId: string
  courseSlug: string
  courseTitle: string
  priceUzs: number
  priceRub: number
  userId: string
}

type Method = 'payme' | 'yookassa'

export default function CheckoutForm({
  courseId, courseSlug, courseTitle, priceUzs, priceRub,
}: CheckoutFormProps) {
  const [method, setMethod] = useState<Method>('payme')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    setLoading(true)
    setError('')

    try {
      if (method === 'payme') {
        const result = await initiatePayme({ courseId, courseSlug, courseTitle, priceUzs })
        if (result.error) { setError(result.error); return }
        window.location.href = result.url!
      } else {
        const result = await initiateYooKassa({ courseId, courseSlug, courseTitle, priceRub })
        if (result.error) { setError(result.error); return }
        window.location.href = result.url!
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Method selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMethod('payme')}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            method === 'payme'
              ? 'border-brand-500 bg-brand-50'
              : 'border-brand-100 bg-white hover:border-brand-200'
          }`}
        >
          <PaymeLogo />
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">Payme</div>
            <div className="text-xs text-brand-600/50">{(priceUzs / 1000).toFixed(0)}k so'm</div>
          </div>
          {method === 'payme' && (
            <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        {priceRub > 0 && (
          <button
            onClick={() => setMethod('yookassa')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              method === 'yookassa'
                ? 'border-brand-500 bg-brand-50'
                : 'border-brand-100 bg-white hover:border-brand-200'
            }`}
          >
            <YooKassaLogo />
            <div className="text-center">
              <div className="text-sm font-semibold text-foreground">ЮKassa</div>
              <div className="text-xs text-brand-600/50">{priceRub.toLocaleString()} ₽</div>
            </div>
            {method === 'yookassa' && (
              <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-cta-600 hover:bg-cta-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors duration-200 cursor-pointer text-base flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Yuklanmoqda...
          </>
        ) : (
          `To'lash — ${method === 'payme' ? `${(priceUzs / 1000).toFixed(0)}k so'm` : `${priceRub.toLocaleString()} ₽`} →`
        )}
      </button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-brand-600/40">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          SSL shifrlash
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brand-600/40">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          7 kun kafolat
        </div>
      </div>
    </div>
  )
}

function PaymeLogo() {
  return (
    <div className="w-12 h-8 bg-[#00AAFF] rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm tracking-tight">P</span>
    </div>
  )
}

function YooKassaLogo() {
  return (
    <div className="w-12 h-8 bg-[#FF6600] rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-xs tracking-tight">ЮK</span>
    </div>
  )
}
