import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-brand-600 text-lg">
          Rus Maktabi
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm text-gray-600 hover:text-brand-600 transition">
            Kurslar
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition"
            >
              Kabinet
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-brand-600 transition">
                Kirish
              </Link>
              <Link
                href="/register"
                className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition"
              >
                Ro'yxat
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
