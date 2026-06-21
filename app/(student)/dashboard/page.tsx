import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import ProfileForm from './profile-form'
import type { Database } from '@/lib/supabase/types'

type UserProfile = Database['public']['Tables']['users']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single() as { data: UserProfile | null }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id, status, paid_at,
      courses (id, title, slug, thumbnail, language, description)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')

  const initials = (profile?.name || user.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid sm:grid-cols-3 gap-6">

        {/* Sidebar: Profile */}
        <aside className="sm:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-brand-100 p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold mb-3">
                {initials}
              </div>
              <div className="text-xs text-brand-600/50">{user.email}</div>
            </div>

            <ProfileForm
              userId={user.id}
              initialName={profile?.name ?? ''}
              initialPhone={profile?.phone ?? ''}
              initialCountry={profile?.country ?? 'UZ'}
            />
          </div>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-sm text-brand-700/50 hover:text-red-500 border border-brand-100 rounded-xl py-2.5 transition-colors duration-150 cursor-pointer"
            >
              Chiqish
            </button>
          </form>
        </aside>

        {/* Main: Courses */}
        <section className="sm:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-foreground">
              Mening kurslarim
            </h1>
            <Link
              href="/courses"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer transition-colors"
            >
              Katalog →
            </Link>
          </div>

          {(!enrollments || enrollments.length === 0) ? (
            <div className="bg-white rounded-2xl border border-brand-100 p-12 text-center">
              <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-brand-700/50 text-sm mb-5">Hali kurslar yo'q</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                Kurslarni ko'rish →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/course/${enrollment.courses?.slug}`}
                  className="flex gap-4 bg-white rounded-2xl border border-brand-100 p-4 hover:shadow-sm hover:border-brand-200 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-20 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {enrollment.courses?.title}
                    </h3>
                    {enrollment.courses?.description && (
                      <p className="text-xs text-brand-700/50 mt-0.5 line-clamp-1">
                        {enrollment.courses.description}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                      Faol
                    </span>
                  </div>
                  <div className="flex items-center text-brand-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
