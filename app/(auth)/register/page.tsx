'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { track } from '@/lib/analytics'

const CONSENT_VERSION = '2.2'
const CONSENT_DATE = '2026-08-10'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [crossBorderConsent, setCrossBorderConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!consent) {
      setError('Davom etish uchun bola maʼlumotlarini qayta ishlashga rozilik bering.')
      return
    }
    if (!crossBorderConsent) {
      setError('Davom etish uchun transchegaraviy uzatish toʻgʻrisida xabardor ekanligingizni tasdiqlang.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          consent_version: CONSENT_VERSION,
          consent_at: new Date().toISOString(),
          cross_border_consent: crossBorderConsent,
          cross_border_consent_at: crossBorderConsent ? new Date().toISOString() : null,
          marketing_consent: marketingConsent,
          marketing_consent_at: marketingConsent ? new Date().toISOString() : null,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Meta Pixel: lead captured (registration completed). Gated by cookie consent
    // (lib/analytics.ts — no-op if user picked "Faqat zaruriy").
    track('Lead', {
      content_name: 'registration',
      content_category: 'signup',
    })

    const requestedNext = new URLSearchParams(window.location.search).get('next')
    const safeNext = requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
      ? requestedNext
      : '/dashboard'
    router.push(safeNext)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Xavfsiz xarid va shaxsiy kabinet
        </span>
        <h1 className="text-2xl font-bold text-foreground">Ro'yxatdan o'tish</h1>
        <p className="text-brand-700/60 mt-1 text-sm">Materiallarni sotib olish va yuklab olish uchun hisob yarating</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-8 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Ism va familiya
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="Sardor Mirzayev"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="kamida 6 belgi"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-2">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="consent" className="text-xs text-brand-700/80 leading-relaxed cursor-pointer">
              Men o'z <strong>farzandim ma'lumotlarini</strong> (ism, yosh, ta'lim darajasi, video/audio yozuvlari, diagnostika natijalari) Bilimora tomonidan qayta ishlashga <strong>qonuniy vakil sifatida rozilik beraman</strong>.{' '}
              <Link href="/legal/children-consent" className="text-brand-600 hover:underline" target="_blank">
                Rozilik shartlari
              </Link>
              ,{' '}
              <Link href="/legal/privacy" className="text-brand-600 hover:underline" target="_blank">
                maxfiylik siyosati
              </Link>
              ,{' '}
              <Link href="/legal/offer" className="text-brand-600 hover:underline" target="_blank">
                ommaviy oferta
              </Link>
              {' '}bilan tanishdim. Rozilikni istalgan vaqtda qaytarib olish mumkin.
            </label>
          </div>

          <div className="flex items-start gap-2.5">
            <input
              id="cross-border-consent"
              type="checkbox"
              checked={crossBorderConsent}
              onChange={e => setCrossBorderConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="cross-border-consent" className="text-xs text-brand-700/80 leading-relaxed cursor-pointer">
              Men o'z farzandim <strong>shaxsiy ma'lumotlarini Irlandiya (EU, eu-west-1)ga</strong> — autentifikatsiya, profil va ta'lim jarayonini saqlash maqsadida — <strong>transchegaraviy uzatish to'g'risida xabardorman</strong> va bunga rozilik beraman. Irlandiya O'zbekiston Respublikasi VM №415 (29.07.2026) bo'yicha adekvat himoya mamlakatlari ro'yxatiga kiritilgan. Batafsil — <Link href="/legal/privacy#transborder" className="text-brand-600 hover:underline" target="_blank">Maxfiylik siyosati §6</Link>.
            </label>
          </div>

          <div className="flex items-start gap-2.5">
            <input
              id="marketing-consent"
              type="checkbox"
              checked={marketingConsent}
              onChange={e => setMarketingConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="marketing-consent" className="text-xs text-brand-700/80 leading-relaxed cursor-pointer">
              <strong>(Ixtiyoriy)</strong> Bilimora'dan foydali materiallar, yangi kurslar va chegirmalar haqida <strong>email orqali xabar yuborishga rozilik beraman</strong>. Har bir xabarda obunani bekor qilish imkoniyati mavjud.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent || !crossBorderConsent}
            className="w-full bg-cta-600 hover:bg-cta-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer mt-2"
          >
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Hisob yaratish →'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-700/60">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:underline cursor-pointer">
            Kirish
          </Link>
        </p>

        <p className="text-center text-xs text-brand-600/40">
          Rozilik versiyasi: v{CONSENT_VERSION} ({CONSENT_DATE})
        </p>
      </div>
    </div>
  )
}
