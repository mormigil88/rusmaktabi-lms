import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Qaytarish siyosati',
  description: "Bilimora to'lovlarni qaytarish siyosati.",
  alternates: { canonical: '/legal/refunds' },
  robots: { index: true, follow: true },
}

function loadLegalBody(filename: string): string {
  const html = readFileSync(join(process.cwd(), 'public/legal', filename), 'utf-8')
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/)
  return m ? m[1] : html
}

export default function RefundsPage() {
  const body = loadLegalBody('refund-policy-uz.html')
  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
