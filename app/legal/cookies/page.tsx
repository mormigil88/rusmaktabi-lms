import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Cookie siyosati',
  description: 'Bilimora cookie-fayllar siyosati.',
  alternates: { canonical: '/legal/cookies' },
  robots: { index: true, follow: true },
}

function loadLegalBody(filename: string): string {
  const html = readFileSync(join(process.cwd(), 'public/legal', filename), 'utf-8')
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/)
  return m ? m[1] : html
}

export default function CookiesPage() {
  const body = loadLegalBody('cookie-policy.html')
  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
