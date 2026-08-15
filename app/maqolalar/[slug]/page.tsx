import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import JsonLd from '@/components/json-ld'
import AnalyticsViewContent from '@/components/analytics-view-content'
import TrackedLink from '@/components/tracked-link'
import { createClient } from '@/lib/supabase/server'
import { articles, getArticle } from '@/lib/articles'
import type { Database } from '@/lib/supabase/types'
import { ENTRY_PRODUCT_SLUG } from '@/lib/funnel'

type Course = Pick<Database['public']['Tables']['courses']['Row'], 'slug' | 'title' | 'price_uzs'>

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Maqola topilmadi' }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/maqolalar/${article.slug}` },
    // Draft content hasn't been fact-checked yet — keep it out of search results until reviewed.
    robots: article.isDraft ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      locale: article.locale === 'uz' ? 'uz_UZ' : 'ru_RU',
    },
  }
}

function renderBody(md: string) {
  const nodes: ReactNode[] = []
  const lines = md.split('\n')
  let listBuffer: string[] = []

  function flushList(key: string) {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={key} className="list-disc pl-5 space-y-1 my-4">
        {listBuffer.map((item, i) => (
          <li key={i} className="text-base text-brand-700/80 leading-relaxed">{item}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  lines.forEach((line, i) => {
    if (line.startsWith('### ')) {
      flushList(`ul-${i}`)
      nodes.push(<h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      flushList(`ul-${i}`)
      nodes.push(<h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>)
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2))
    } else if (line.trim() !== '') {
      flushList(`ul-${i}`)
      nodes.push(<p key={i} className="text-base text-brand-700/80 leading-relaxed my-3">{line}</p>)
    }
  })
  flushList('ul-end')

  return nodes
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const translation = article.translationSlug ? getArticle(article.translationSlug) : undefined

  const supabase = await createClient()
  const { data: product } = await supabase
    .from('courses')
    .select('slug, title, price_uzs')
    .eq('slug', ENTRY_PRODUCT_SLUG)
    .eq('product_type', 'digital_product')
    .eq('status', 'published')
    .limit(1)
    .maybeSingle() as { data: Course | null }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    dateModified: article.updatedAt,
    inLanguage: article.locale === 'uz' ? 'uz' : 'ru',
    author: { '@type': 'Organization', name: 'Bilimora' },
    publisher: { '@type': 'Organization', name: 'Bilimora' },
  }

  return (
    <>
      <Navbar />
      <JsonLd data={jsonLd} />
      <AnalyticsViewContent
        contentName={article.title}
        contentCategory="article"
      />

      <article className="max-w-2xl mx-auto px-4 py-10 sm:py-12">
        {article.isDraft && (
          <div className="bg-coral-50 border border-coral-100 text-coral-700 text-sm rounded-xl px-4 py-3 mb-6">
            Qoralama — bu material hali tekshiruvdan o&apos;tmagan, nashrdan oldin faktlar tasdiqlanadi.
          </div>
        )}

        {translation && (
          <Link
            href={`/maqolalar/${translation.slug}`}
            className="inline-block text-sm text-brand-600 hover:text-brand-700 cursor-pointer mb-4"
          >
            {translation.locale === 'ru' ? 'Читать на русском →' : "O'zbekcha o'qish →"}
          </Link>
        )}

        <h1 className="text-3xl font-bold text-foreground leading-tight mb-6">{article.title}</h1>

        <div>{renderBody(article.body)}</div>

        {/* One primary conversion: article → 49k digital product. */}
        <section className="bg-brand-700 rounded-2xl mt-12 px-6 py-8 text-center">
          {product ? (
            <>
              <h2 className="text-xl font-bold text-white mb-2">
                {article.locale === 'ru' ? 'Проверьте документы до подачи в школу' : "Hujjatlarni maktabga topshirishdan oldin tekshiring"}
              </h2>
              <p className="text-brand-200 text-sm mb-2 max-w-md mx-auto">
                {product.title}
              </p>
              <p className="text-white font-bold text-lg mb-6">
                {(product.price_uzs / 1000).toFixed(0)}k so&apos;m
              </p>
              <TrackedLink
                href={`/course/${product.slug}`}
                eventName="article_cta_click"
                eventParams={{
                  article_slug: article.slug,
                  product_slug: product.slug,
                  value: product.price_uzs,
                  currency: 'UZS',
                }}
                className="inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                {article.locale === 'ru' ? 'Получить материалы →' : 'Materiallarni olish →'}
              </TrackedLink>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Chek-list va hujjat shablonlari</h2>
              <p className="text-sm text-brand-200">Maktabga qabul uchun hujjatlar to&apos;plami tez orada e&apos;lon qilinadi.</p>
            </>
          )}
        </section>
      </article>
    </>
  )
}
