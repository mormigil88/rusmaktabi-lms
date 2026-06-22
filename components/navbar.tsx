import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-brand-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-brand-700 text-lg tracking-tight flex-shrink-0">
          Rus Maktabi
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          {/* Desktop only */}
          <Link href="/courses" className="hidden sm:block text-sm text-brand-800/70 hover:text-brand-600 transition-colors duration-150 cursor-pointer">
            Kurslar
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-3 sm:px-4 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer font-medium"
            >
              <span className="hidden sm:inline">Kabinet</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm text-brand-800/70 hover:text-brand-600 transition-colors duration-150 cursor-pointer">
                Kirish
              </Link>
              <Link
                href="/register"
                className="text-xs sm:text-sm bg-cta-600 hover:bg-cta-700 text-white px-3 sm:px-4 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer font-medium whitespace-nowrap"
              >
                <span className="hidden sm:inline">Bepul diagnostika</span>
                <span className="sm:hidden">Ro'yxat</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
