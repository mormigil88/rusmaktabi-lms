import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { articles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'
import type { Database } from '@/lib/supabase/types'

/**
 * Course rows live in Supabase, which isn't reachable at build time — the same
 * reason the public pages opt into force-dynamic. Generate per request so a
 * newly published course appears without a redeploy.
 */
export const dynamic = 'force-dynamic'

type CourseRow = Pick<Database['public']['Tables']['courses']['Row'], 'slug' | 'created_at'>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/maqolalar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Drafts carry a noindex meta tag until the facts are checked — keeping them
  // out of the sitemap keeps the two signals consistent.
  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter(article => !article.isDraft)
    .map(article => ({
      url: `${SITE_URL}/maqolalar/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  let courseRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: courses } = await supabase
      .from('courses')
      .select('slug, created_at')
      .eq('status', 'published') as { data: CourseRow[] | null }

    courseRoutes = (courses ?? []).map(course => ({
      url: `${SITE_URL}/course/${course.slug}`,
      lastModified: new Date(course.created_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  } catch {
    // A database hiccup shouldn't return a 500 for /sitemap.xml — serving the
    // static routes is strictly better than serving nothing.
  }

  return [...staticRoutes, ...courseRoutes, ...articleRoutes]
}
