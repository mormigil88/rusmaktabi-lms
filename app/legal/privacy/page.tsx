import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Maxfiylik siyosati',
  description: "Bilimora maxfiylik siyosati: shaxsiy ma'lumotlarni yig'ish, qayta ishlash va himoya qilish qoidalari.",
  alternates: { canonical: '/legal/privacy' },
  robots: { index: true, follow: true },
}

function loadLegalBody(filename: string): string {
  const html = readFileSync(join(process.cwd(), 'public/legal', filename), 'utf-8')
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/)
  return m ? m[1] : html
}

export default function PrivacyPage() {
  const body = loadLegalBody('privacy-policy-uz.html')
  return (
    <>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
