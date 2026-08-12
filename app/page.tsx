export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/navbar'
import JsonLd from '@/components/json-ld'
import { createClient } from '@/lib/supabase/server'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { ENTRY_ARTICLE_PATH, ENTRY_PRODUCT_SLUG } from '@/lib/funnel'

const features = [
  {
    title: "Maktab dasturiga mos",
    desc: "Darslar aniq maktab talablari asosida tuzilgan — umumiy kurs emas, maqsadli tayyorgarlik.",
  },
  {
    title: "Individual tezlik",
    desc: "Har bir bola bilan alohida ishlaymiz. Sinfda emas, o'zingizning bolangiz bilan.",
  },
  {
    title: "Hujjatlardan boshlaysiz",
    desc: "Avval qabul hujjatlarini to'g'ri tayyorlaysiz. Materiallardan keyin bolangiz uchun bepul diagnostika olasiz.",
  },
  {
    title: "Onlayn, o'zingizga qulay vaqtda",
    desc: "Zoom orqali, jadval bo'yicha. Toshkentdan, Samarqanddan yoki Farg'onadan — farqi yo'q.",
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: entryProduct } = await supabase
    .from('courses')
    .select('slug, price_uzs')
    .eq('slug', ENTRY_PRODUCT_SLUG)
    .eq('status', 'published')
    .maybeSingle() as { data: { slug: string; price_uzs: number } | null }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "O'zbek bolalarini Rossiya maktabiga qabul qilish uchun hujjatlar, rus tili testi va o'qituvchi bilan tayyorgarlik.",
    inLanguage: ['uz', 'ru'],
    areaServed: ['UZ', 'RU'],
  }

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Maktabga qabul — hujjatlar va til testi
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
              Bolangizni<br />
              <span className="text-brand-600">Rossiya maktabiga</span><br />
              tayyorlaymiz
            </h1>
            <p className="text-lg text-brand-800/70 mb-8 max-w-md">
              Qabul hujjatlarini tayyorlang, majburiy til testini tushuning
              va keyin o&apos;qituvchimiz bilan bepul diagnostikadan o&apos;ting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={ENTRY_ARTICLE_PATH}
                className="inline-flex items-center justify-center gap-2 bg-cta-600 hover:bg-cta-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Qabul tartibini o&apos;qish →
              </Link>
              <Link
                href={entryProduct ? `/course/${entryProduct.slug}` : '/courses'}
                className="inline-flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                49k so&apos;mlik materiallar
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100">
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '49k', label: 'Hujjatlar to\'plami', sub: "so'm" },
                { value: '2 til', label: "O'zbekcha + ruscha", sub: 'bitta PDF' },
                { value: '20 min', label: 'Keyingi diagnostika', sub: "o'qituvchi bilan" },
                { value: '3 oy', label: "Qayta test muddati", sub: 'oldindan tayyorlaning' },
              ].map(s => (
                <div key={s.label} className="animate-stat">
                  <div className="text-2xl font-bold text-brand-700">{s.value}</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{s.label}</div>
                  <div className="text-xs text-brand-600/60 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="bg-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Tanish holat?</h2>
          <p className="text-brand-200 text-lg max-w-2xl mx-auto">
            Bola Rossiya maktabiga qabul qilinmay qolishi mumkin: hujjatlar to&apos;liq emas yoki majburiy rus tili testi topshirilmagan.
            Birinchi qadam — qabul jarayonini to&apos;g&apos;ri o&apos;tish.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Qanday ishlaydi?</h2>
          <p className="text-center text-brand-800/60 mb-10">4 qadam — hujjatlardan individual tayyorgarlikkacha</p>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Maqola',
                desc: 'Qabul hujjatlari va majburiy rus tili testi qanday ishlashini bilib oling.',
              },
              {
                step: '2',
                title: 'Materiallar — 49k',
                desc: 'Chek-list va tayyor shablonlar bilan hujjatlarni xatosiz tayyorlang.',
              },
              {
                step: '3',
                title: 'Bepul diagnostika',
                desc: "O'qituvchimiz Zoom orqali 20 daqiqada bolangiz darajasini tekshiradi.",
              },
              {
                step: '4',
                title: "Repetitorlik",
                desc: "Kerak bo'lsa, test va maktab uchun individual tayyorgarlik rejasini boshlaysiz.",
              },
            ].map(item => (
              <div key={item.step} className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
                <div className="w-10 h-10 bg-brand-600 text-white font-bold text-lg rounded-full flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-brand-800/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One entry product — the next service is offered only after purchase. */}
      <section className="bg-white border-t border-brand-100">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Birinchi mahsulot — qabul materiallari</h2>
          <p className="text-center text-brand-800/60 mb-10">Bitta aniq muammo, bitta aniq keyingi qadam</p>
          <div className="bg-brand-50 rounded-2xl p-7 border border-brand-100">
            <h3 className="font-semibold text-foreground mb-2">Chek-list va hujjat shablonlari</h3>
            <p className="text-sm text-brand-800/70 leading-relaxed mb-5">
              Rossiya maktabiga qabul uchun hujjatlar ro&apos;yxati, tayyor shablonlar va bosqichma-bosqich yo&apos;riqnoma.
            </p>
            <div className="font-bold text-2xl text-foreground mb-5">
              {entryProduct ? `${(entryProduct.price_uzs / 1000).toFixed(0)}k so'm` : '49k so\'m'}
            </div>
            <Link
              href={entryProduct ? `/course/${entryProduct.slug}` : ENTRY_ARTICLE_PATH}
              className="block w-full bg-coral-500 hover:bg-coral-600 text-white font-semibold py-3 rounded-xl text-center transition-colors duration-200 cursor-pointer"
            >
              Materiallarni olish →
            </Link>
            <p className="text-xs text-brand-600/60 text-center mt-4">
              Xariddan keyin o&apos;qituvchi bilan 20 daqiqalik bepul diagnostikaga yozilishingiz mumkin.
            </p>
          </div>
        </div>
      </section>

      {/* Nima uchun biz */}
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Nima uchun Bilimora?</h2>
          <p className="text-center text-brand-800/60 mb-10">Kursning asosiy ustuvorliklari</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-brand-800/70 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Avval qabul jarayonini tushunib oling
          </h2>
          <p className="text-brand-200 mb-8">
            Maqolani o&apos;qing, hujjatlar to&apos;plamini oling va keyin bolangizni o&apos;qituvchimiz bilan bepul tekshirtiring.
          </p>
          <Link
            href={ENTRY_ARTICLE_PATH}
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-50 text-brand-700 font-bold px-10 py-4 rounded-xl transition-colors duration-200 text-base cursor-pointer"
          >
            Maqolani o&apos;qish →
          </Link>
          <p className="text-brand-300 text-xs mt-4">Reels → maqola → 49k materiallar → bepul diagnostika</p>
        </div>
      </section>

      <footer className="bg-white border-t border-brand-100 py-6 text-center text-sm text-brand-600/50">
        © 2026 Bilimora. Barcha huquqlar himoyalangan.
      </footer>
    </>
  )
}
