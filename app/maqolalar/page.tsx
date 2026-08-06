import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Maqolalar',
  description: "Ota-onalar uchun foydali maqolalar — bolani Rossiya maktabiga tayyorlash bo'yicha maslahatlar.",
}

const LOCALE_LABEL: Record<string, string> = { uz: "O'zbekcha", ru: 'Русский' }

export default function ArticlesListPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Maqolalar</h1>
        <p className="text-brand-700/60 mb-10">Ota-onalar uchun foydali maslahatlar va yo&apos;riqnomalar</p>

        <div className="space-y-4">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/maqolalar/${article.slug}`}
              className="block bg-white rounded-2xl border border-brand-100 p-6 hover:border-brand-200 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                  {LOCALE_LABEL[article.locale]}
                </span>
                {article.isDraft && (
                  <span className="text-xs bg-coral-50 text-coral-700 px-2 py-0.5 rounded-full font-medium">
                    Qoralama
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1.5">{article.title}</h2>
              <p className="text-sm text-brand-700/70 leading-relaxed">{article.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
