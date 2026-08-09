/**
 * Client-side analytics helpers. Safe to call on the server — every fn short-circuits
 * if `window`/`fbq` aren't there (SSR), and if the user hasn't granted marketing consent.
 *
 * Events are only sent when localStorage `bilimora_cookie_consent.value === 'all'`.
 * That keeps Meta Pixel in line with the cookie banner + GDPR-style consent UX.
 */

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'

type FbqFn = (...args: unknown[]) => void
declare global {
  interface Window {
    fbq?: FbqFn & { callMethod?: FbqFn; queue?: unknown[]; loaded?: boolean; version?: string }
    _fbq?: FbqFn
  }
}

function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { value?: string }
    return parsed.value === 'all'
  } catch {
    return false
  }
}

function fbq(): FbqFn | null {
  if (typeof window === 'undefined') return null
  return window.fbq ?? null
}

/**
 * Standard Meta Pixel event (matches a built-in like 'ViewContent', 'Lead', 'Purchase').
 * https://developers.facebook.com/docs/meta-pixel/reference
 */
export function track(event: string, params?: Record<string, unknown>): void {
  if (!hasMarketingConsent()) return
  const fn = fbq()
  if (!fn) return
  fn('track', event, params)
}

/**
 * Custom event name (anything not in the standard list, e.g. 'PDF Download').
 */
export function trackCustom(event: string, params?: Record<string, unknown>): void {
  if (!hasMarketingConsent()) return
  const fn = fbq()
  if (!fn) return
  fn('trackCustom', event, params)
}

/**
 * True iff Pixel has been initialised in this tab — useful to avoid calling
 * `track` before the script finishes loading (it queues by default, but explicit
 * checks help when debugging).
 */
export function pixelReady(): boolean {
  return typeof window !== 'undefined' && Boolean(window.fbq) && hasMarketingConsent()
}
