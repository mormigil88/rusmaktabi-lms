import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-brand-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-brand-700 text-lg tracking-tight">
          Rus Maktabi
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/courses" className="text-sm text-brand-800/70 hover:text-brand-600 transition-colors duration-150 cursor-pointer">
            Kurslar
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer font-medium"
            >
              Kabinet
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-brand-800/70 hover:text-brand-600 transition-colors duration-150 cursor-pointer">
                Kirish
              </Link>
              <Link
                href="/register"
                className="text-sm bg-cta-600 hover:bg-cta-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer font-medium"
              >
                Bepul diagnostika
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
