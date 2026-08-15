import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NOINDEX } from '@/lib/site'
import MarketingConsentToggle from '@/components/marketing-consent-toggle'
import type { Metadata } from 'next'

export const metadata: Metadata = NOINDEX

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const email = user.email || ''
  const displayName = (user.user_metadata?.name as string) || ''

  const marketingGranted = Boolean(user.user_metadata?.marketing_consent)
  const marketingGrantedAt = (user.user_metadata?.marketing_consent_at as string | undefined) ?? null
  const marketingRevokedAt = (user.user_metadata?.marketing_consent_revoked_at as string | undefined) ?? null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Maxfiylik va shaxsiy ma'lumotlar</h1>
        <p className="text-brand-700/70 mt-2 text-sm">
          Bilimora sizning va farzandingizning shaxsiy ma'lumotlarini
          {' '}
          <Link href="/legal/privacy" className="text-brand-600 hover:underline" target="_blank">
            Maxfiylik siyosati
          </Link>
          {' '}ga muvofiq qayta ishlaydi. Quyida siz O'zbekiston Respublikasining
          {' '}<strong>«Shaxsiy ma'lumotlar to'g'risida»gi Qonuni (ЗРУ-547)</strong>{' '}
          ga asosan tegishli huquqlardan foydalanishingiz mumkin.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          <strong>Eslatma.</strong> Onlayn DSR-forma hozircha tayyorlanmoqda. Quyidagi
          tugmalar orqali hozir boshqarishingiz mumkin bo'lgan narsalar — email-rozilik.
          Boshqa so'rovlar uchun <strong>legal@bilimora.uz</strong> manziliga yozing —
          10 ish kuni ichida javob beramiz.
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">Email-rozilik (marketing)</h2>
          <p className="text-sm text-brand-700/70 mb-3">
            Ro'yxatdan o'tishda berilgan ixtiyoriy rozilik. Bu yerda uni bekor qilishingiz
            yoki qayta yoqishingiz mumkin (ZRU-547 17-moddasi).
          </p>
          <MarketingConsentToggle
            initialGranted={marketingGranted}
            grantedAt={marketingGrantedAt}
            revokedAt={marketingRevokedAt}
          />
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-2">Sizning huquqlaringiz</h2>
          <ul className="space-y-2 text-sm text-brand-800">
            <li>
              <strong>Ma'lumotlaringiz nusxasini olish</strong> — Bilimora siz
              haqingizda qanday ma'lumot saqlashini bilish.
            </li>
            <li>
              <strong>O'zgartirish</strong> — noto'g'ri yoki eskirgan ma'lumotni
              tuzatish.
            </li>
            <li>
              <strong>O'chirish</strong> — hisob va bola ma'lumotlarini butunlay
              o'chirish (anonimlashtirish).
            </li>
            <li>
              <strong>Rozilikni qaytarib olish</strong> — bola ma'lumotlarini
              qayta ishlashga berilgan rozilikni istalgan vaqtda bekor qilish.
            </li>
            <li>
              <strong>Shikoyat</strong> — agar huquqlaringiz buzilgan deb
              hisoblasangiz, <em>vakolatli davlat organiga</em> murojaat qilish
              (batafsil —{' '}
              <Link href="/legal/privacy" className="text-brand-600 hover:underline" target="_blank">
                Maxfiylik siyosati §13
              </Link>
              ).
            </li>
          </ul>
        </div>

        <div className="border-t border-brand-100 pt-5">
          <h2 className="font-semibold text-foreground mb-3">Boshqa so'rovlar uchun</h2>
          <p className="text-sm text-brand-700/70 mb-3">
            Quyidagi ma'lumotlarni <strong>legal@bilimora.uz</strong> manziliga
            yuboring. Sizning so'rovingiz 10 ish kuni ichida ko'rib chiqiladi.
          </p>
          <pre className="bg-brand-50 rounded-xl p-4 text-xs text-brand-800 whitespace-pre-wrap font-mono">
{`Kimdan: ${displayName || '—'}
Email: ${email}

So'rov turi: ☐ Ma'lumot nusxasi  ☐ O'zgartirish  ☐ O'chirish  ☐ Rozilikni qaytarib olish  ☐ Shikoyat

Izoh: (qisqacha tushuntiring)`}
          </pre>
        </div>

        <div className="border-t border-brand-100 pt-5">
          <h2 className="font-semibold text-foreground mb-2">Foydali havolalar</h2>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/legal/privacy" className="text-brand-600 hover:underline" target="_blank">
                Maxfiylik siyosati (to'liq)
              </Link>
            </li>
            <li>
              <Link href="/legal/children-consent" className="text-brand-600 hover:underline" target="_blank">
                Bola ma'lumotlarini qayta ishlashga rozilik shartlari
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="text-brand-600 hover:underline" target="_blank">
                Cookie-fayllar siyosati
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-brand-100 pt-5">
          <Link href="/dashboard" className="text-sm text-brand-700/70 hover:text-brand-600">
            ← Dashboardga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}
