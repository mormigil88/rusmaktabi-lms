import Link from 'next/link'
import Navbar from '@/components/navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            #1 O'zbek bolalari uchun rus tili
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Bolangiz 4 haftada<br />
            <span className="text-brand-600">Rossiya maktabiga tayyor</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            Online darslar, tajribali o'qituvchilar va to'liq maktab dasturi.
            Bepul diagnostika — hoziroq boshlang.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base"
            >
              Bepul diagnostika →
            </Link>
            <Link
              href="/courses"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition text-base"
            >
              Kurslarni ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-3 gap-6 text-white text-center">
          {[
            { value: '4 hafta', label: "O'rtacha o'rganish vaqti" },
            { value: '97%', label: 'Maktabga qabul' },
            { value: '$200', label: "To'liq kurs narxi" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <div className="text-brand-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Qanday ishlaydi?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Bepul diagnostika', desc: 'Zoom orqali 20 daqiqa — bolangiz darajasini aniqlaymiz' },
              { step: '2', title: 'Individual dastur', desc: "Bolangiz uchun maxsus o'quv rejasi tuziladi" },
              { step: '3', title: 'Natija kafolati', desc: '4 haftada maktab talablariga javob beradi' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bepul diagnostikaga yoziling</h2>
          <p className="text-gray-500 mb-8">Hozir joylar cheklangan. 20 daqiqa Zoom — hech qanday majburiyat yo'q.</p>
          <Link
            href="/register"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-10 py-3.5 rounded-xl transition"
          >
            Hozir yozilish →
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2026 Rus Maktabi. Barcha huquqlar himoyalangan.
      </footer>
    </>
  )
}
