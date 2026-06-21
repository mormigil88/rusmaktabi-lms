'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Bepul diagnostika — 20 daqiqa
        </span>
        <h1 className="text-2xl font-bold text-foreground">Ro'yxatdan o'tish</h1>
        <p className="text-brand-700/60 mt-1 text-sm">Bir daqiqa — bolangiz darajasini aniqlaylik</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-8 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Ism va familiya
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="Sardor Mirzayev"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-brand-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="kamida 6 belgi"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cta-600 hover:bg-cta-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer mt-2"
          >
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Bepul diagnostikaga yozilish →'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-700/60">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:underline cursor-pointer">
            Kirish
          </Link>
        </p>

        <p className="text-center text-xs text-brand-600/40">
          Ro'yxatdan o'tish bilan siz shartlarga rozilik bildirasiz
        </p>
      </div>
    </div>
  )
}
