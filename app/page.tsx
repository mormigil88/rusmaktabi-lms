export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/navbar'

const testimonials = [
  {
    text: "Qizim 3 haftada Rossiya maktabiga kirishga muvaffaq bo'ldi. O'qituvchi juda professional, darslar qiziqarli.",
    name: 'Mohira Yusupova',
    role: 'Toshkent, 2 farzand onasi',
    result: '3 haftada natija',
  },
  {
    text: "Boshqa kurslarda pul sarflab ko'rdik — natija yo'q edi. Rus Maktabida 4 haftada o'g'lim 5-sinfga qabul qilindi.",
    name: 'Sardor Mirzayev',
    role: 'Samarqand, ota',
    result: '5-sinfga qabul',
  },
  {
    text: "Diagnostika bepul, vaqt yo'qotmasdan hozirda darajasini bildik. Keyin intensiv kursga yozdik — sifati a'lo.",
    name: 'Nilufar Rahimova',
    role: "Farg'ona, ona",
    result: 'Bepul diagnostika',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              200+ muvaffaqiyatli o'quvchi
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
              Bolangizni<br />
              <span className="text-brand-600">Rossiya maktabiga</span><br />
              4 haftada tayyorlaymiz
            </h1>
            <p className="text-lg text-brand-800/70 mb-8 max-w-md">
              Professional o'qituvchilar, individual dastur va natija kafolati.
              Minglab oilalar bizga ishondi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-cta-600 hover:bg-cta-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Bepul diagnostika →
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Kurslarni ko'rish
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100">
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '97%', label: 'Maktabga qabul', sub: 'kafolatli natija' },
                { value: '4 hafta', label: "O'rtacha muddati", sub: 'to\'liq kurs' },
                { value: '200+', label: 'Muvaffaq oilalar', sub: 'butun O\'zbekiston' },
                { value: '$200', label: 'To\'liq kurs narxi', sub: 'yoki diagnostika bepul' },
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
            Bola Rossiyaga ko'chib o'tmoqchi, lekin maktabga kirishda rus tili to'siq.
            Oddiy kurslar yetarli emas — kerak maktab dasturiga moslashgan intensiv tayyorgarlik.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Qanday ishlaydi?</h2>
          <p className="text-center text-brand-800/60 mb-10">3 oddiy qadam — maktabga kirishgacha</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Bepul diagnostika',
                desc: 'Zoom orqali 20 daqiqa. Bolangiz darajasini va qaysi sinfga mos kelishini aniqlaymiz.',
              },
              {
                step: '2',
                title: 'Individual dastur',
                desc: 'Aniq maktab talablari asosida to\'liq o\'quv rejasi tuziladi. Hech kim ketib qolmaydi.',
              },
              {
                step: '3',
                title: 'Natija — maktabga qabul',
                desc: '4 haftada maktab darajasiga yetkazamiz. Aks holda pul qaytariladi.',
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

      {/* Testimonials */}
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Ota-onalar nima deydi?</h2>
          <p className="text-center text-brand-800/60 mb-10">Haqiqiy oilalar — haqiqiy natijalar</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-brand-800/80 italic leading-relaxed mb-4">"{t.text}"</p>
                <div className="border-t border-brand-100 pt-4">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-brand-600/70">{t.role}</div>
                  <span className="inline-block mt-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                    {t.result}
                  </span>
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
            Bugun bepul diagnostikaga yoziling
          </h2>
          <p className="text-brand-200 mb-8">
            Joylar cheklangan. 20 daqiqa Zoom — bolangiz darajasini bilib oling, hech qanday majburiyatsiz.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-50 text-brand-700 font-bold px-10 py-4 rounded-xl transition-colors duration-200 text-base cursor-pointer"
          >
            Bepul diagnostika →
          </Link>
          <p className="text-brand-300 text-xs mt-4">Pul to'lovIsiz • Zoom orqali • 20 daqiqa</p>
        </div>
      </section>

      <footer className="bg-white border-t border-brand-100 py-6 text-center text-sm text-brand-600/50">
        © 2026 Rus Maktabi. Barcha huquqlar himoyalangan.
      </footer>
    </>
  )
}
