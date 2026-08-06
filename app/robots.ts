import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Only /api/ is disallowed here. Private pages (/dashboard, /admin, /login,
 * /register, checkout, lessons) are kept out of the index with a `noindex` meta
 * tag instead — deliberately, not by omission:
 *
 *   - A robots.txt `Disallow` blocks crawling, so the crawler never reads the
 *     `noindex` on that page. A URL linked from elsewhere can then still show up
 *     in results as "indexed, though blocked by robots.txt". `noindex` is the
 *     only directive that reliably keeps a page out.
 *   - robots.txt is public, so listing private paths advertises the admin
 *     surface to anyone who asks for it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
