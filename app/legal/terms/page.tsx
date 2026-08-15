import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Foydalanish shartlari',
  description: 'Bilimora platformasidan foydalanish shartlari.',
  alternates: { canonical: '/legal/terms' },
  robots: { index: true, follow: true },
}

function loadLegalBody(filename: string): string {
  const html = readFileSync(join(process.cwd(), 'public/legal', filename), 'utf-8')
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/)
  return m ? m[1] : html
}

export default function TermsPage() {
  const body = loadLegalBody('terms-of-service-uz.html')
  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
