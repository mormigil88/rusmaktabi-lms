import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-brand-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-bold text-brand-700 text-lg tracking-tight">
            Rus Maktabi
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-brand-600/40">
        © 2026 Rus Maktabi
      </footer>
    </div>
  )
}
