import Link from 'next/link'
import CookieSettingsButton from './cookie-settings-button'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-brand-700/60">
            © {new Date().getFullYear()} Bilimora. Barcha huquqlar himoyalangan.
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/legal/privacy"
              className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150"
            >
              Maxfiylik siyosati
            </Link>
            <Link
              href="/legal/terms"
              className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150"
            >
              Foydalanish shartlari
            </Link>
            <Link
              href="/legal/offer"
              className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150"
            >
              Oferta
            </Link>
            <Link
              href="/legal/cookies"
              className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150"
            >
              Cookie
            </Link>
            <CookieSettingsButton />
            <Link
              href="/legal/refunds"
              className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150"
            >
              Qaytarish
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
