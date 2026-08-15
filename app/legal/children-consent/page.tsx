import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: "Bola ma'lumotlarini qayta ishlashga rozilik",
  description: "Bilimora — bola shaxsiy ma'lumotlarini qayta ishlash uchun ota-onaning roziligi shartlari.",
  alternates: { canonical: '/legal/children-consent' },
  robots: { index: true, follow: true },
}

function loadLegalBody(filename: string): string {
  const html = readFileSync(join(process.cwd(), 'public/legal', filename), 'utf-8')
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/)
  return m ? m[1] : html
}

export default function ChildrenConsentPage() {
  const body = loadLegalBody('children-data-consent.html')
  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
