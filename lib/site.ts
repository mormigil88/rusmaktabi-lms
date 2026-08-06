/**
 * Single source of truth for the public origin and brand name.
 *
 * Every absolute URL the crawler sees — metadataBase, sitemap entries, robots.txt,
 * JSON-LD @id — has to agree, otherwise Google treats them as separate sites.
 * NEXT_PUBLIC_APP_URL is set per environment (Vercel); the fallback only matters
 * for local dev, where absolute URLs aren't checked by anything.
 */
import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bilimyo.uz').replace(/\/+$/, '')

export const SITE_NAME = 'Bilimyo'

/**
 * Applied to pages that exist only for signed-in users (dashboard, checkout,
 * lessons, admin) and to the auth screens. These are reachable without a
 * session — /login and /register are linked from public pages — so the crawler
 * will fetch them; `noindex` is what keeps them out of the results.
 *
 * Spread it into a page's own metadata rather than replacing it:
 * a child's `robots` field overrides the parent layout's wholesale.
 */
export const NOINDEX: Metadata = {
  robots: { index: false, follow: false },
}

