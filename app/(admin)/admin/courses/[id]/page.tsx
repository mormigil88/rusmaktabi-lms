import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateCourse, updateLesson, addLesson, addModule } from '@/app/actions/admin'

type Lesson = { id: string; title: string; video_url: string | null; is_free: boolean; duration_min: number; order: number }
type Module = { id: string; title: string; order: number; lessons: Lesson[] }
type Course = {
  id: string; title: string; slug: string; description: string | null
  price_uzs: number; price_rub: number; status: string
  modules: Module[]
}

export default async function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createServiceClient()

  const { data: course } = await db
    .from('courses')
    .select('id, title, slug, description, price_uzs, price_rub, status, modules(id, title, order, lessons(id, title, video_url, is_free, duration_min, order))')
    .eq('id', id)
    .single() as { data: Course | null }

  if (!course) notFound()

  const modules = (course.modules ?? []).sort((a, b) => a.order - b.order)
    .map(m => ({ ...m, lessons: (m.lessons ?? []).sort((a, b) => a.order - b.order) }))

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/courses" className="hover:text-brand-600 cursor-pointer">Курсы</Link>
        <span>/</span>
        <span className="text-gray-700">{course.title}</span>
      </div>

      {/* Course edit form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Основное</h2>
        <form action={updateCourse} className="space-y-4">
          <input type="hidden" name="id" value={course.id} />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Название</label>
            <input
              name="title"
              defaultValue={course.title}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Описание</label>
            <textarea
              name="description"
              defaultValue={course.description ?? ''}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Цена (сум)</label>
              <input
                name="price_uzs"
                type="number"
                defaultValue={course.price_uzs}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Цена (₽)</label>
              <input
                name="price_rub"
                type="number"
                defaultValue={course.price_rub}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Сохранить
          </button>
        </form>
      </div>

      {/* Modules & Lessons */}
      <div className="space-y-4">
        {modules.map(mod => (
          <div key={mod.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{mod.order}. {mod.title}</span>
              <span className="text-xs text-gray-400">{mod.lessons.length} уроков</span>
            </div>

            {/* Lessons list */}
            <div className="divide-y divide-gray-100">
              {mod.lessons.map(lesson => (
                <details key={lesson.id} className="group">
                  <summary className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50/60 list-none">
                    <span className="text-xs text-gray-400 w-5">{lesson.order}</span>
                    <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                    <div className="flex items-center gap-2">
                      {lesson.is_free && (
                        <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">бесплатный</span>
                      )}
                      <span className="text-xs text-gray-400">{lesson.duration_min} мин</span>
                      <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                    <form action={updateLesson} className="space-y-3">
                      <input type="hidden" name="id" value={lesson.id} />
                      <input type="hidden" name="course_id" value={course.id} />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Название</label>
                          <input name="title" defaultValue={lesson.title} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">YouTube ID</label>
                          <input name="video_url" defaultValue={lesson.video_url ?? ''} placeholder="dQw4w9WgXcQ" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Длительность (мин)</label>
                          <input name="duration_min" type="number" defaultValue={lesson.duration_min} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="hidden" name="is_free" value="false" />
                            <input name="is_free" type="checkbox" value="true" defaultChecked={lesson.is_free} className="rounded" />
                            Бесплатный
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Конспект (Markdown)</label>
                        <textarea name="content_md" rows={3} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300" />
                      </div>
                      <button type="submit" className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        Сохранить урок
                      </button>
                    </form>
                  </div>
                </details>
              ))}
            </div>

            {/* Add lesson form */}
            <details className="border-t border-gray-100">
              <summary className="px-5 py-2.5 text-xs text-brand-600 hover:text-brand-700 cursor-pointer list-none hover:bg-brand-50/40">
                + Добавить урок
              </summary>
              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                <form action={addLesson} className="space-y-3">
                  <input type="hidden" name="module_id" value={mod.id} />
                  <input type="hidden" name="course_id" value={course.id} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Название</label>
                      <input name="title" required placeholder="Буква А — звук и написание" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">YouTube ID</label>
                      <input name="video_url" placeholder="dQw4w9WgXcQ" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Длительность (мин)</label>
                      <input name="duration_min" type="number" defaultValue={15} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="hidden" name="is_free" value="false" />
                        <input name="is_free" type="checkbox" value="true" className="rounded" />
                        Бесплатный
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                    Добавить
                  </button>
                </form>
              </div>
            </details>
          </div>
        ))}

        {/* Add module */}
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Добавить модуль</h3>
          <form action={addModule} className="flex gap-3">
            <input type="hidden" name="course_id" value={course.id} />
            <input
              name="title"
              required
              placeholder="Название модуля"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors">
              Добавить
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
