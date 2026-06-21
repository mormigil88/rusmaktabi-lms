import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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
      *,
      courses (id, title, slug, thumbnail, language)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Salom, {profile?.name || user.email} 👋
      </h1>
      <p className="text-gray-500 mb-8">Mening kurslarim / Мои курсы</p>

      {(!enrollments || enrollments.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">Hali kurs yo'q</p>
          <a
            href="/courses"
            className="inline-block bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
          >
            Kurslarni ko'rish →
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {enrollments.map((enrollment: any) => (
            <a
              key={enrollment.id}
              href={`/course/${enrollment.courses.slug}`}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
            >
              {enrollment.courses.thumbnail && (
                <img
                  src={enrollment.courses.thumbnail}
                  alt={enrollment.courses.title}
                  className="w-full h-36 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold text-gray-900">{enrollment.courses.title}</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                {enrollment.courses.language === 'ru' ? 'Русский язык' : enrollment.courses.language}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
