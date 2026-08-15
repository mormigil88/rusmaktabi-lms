/** Client-side funnel analytics for GA4, Yandex.Metrica and Meta Pixel. */

const COOKIE_CONSENT_KEY = 'bilimora_cookie_consent'
const ATTRIBUTION_KEY = 'bilimora_attribution'
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID ?? 109950575)

type FbqFn = (...args: unknown[]) => void
type GtagFn = (...args: unknown[]) => void
type YmFn = (...args: unknown[]) => void

type Attribution = Partial<Record<
  'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'referrer',
  string
>>

declare global {
  interface Window {
    fbq?: FbqFn & { callMethod?: FbqFn; queue?: unknown[]; loaded?: boolean; version?: string }
    _fbq?: FbqFn
    gtag?: GtagFn
    ym?: YmFn
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

function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? '{}') as Attribution
  } catch {
    return {}
  }
}

export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const current: Attribution = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
    const value = params.get(key)
    if (value) current[key] = value.slice(0, 200)
  }
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    current.referrer = document.referrer.slice(0, 500)
  }

  const attribution = { ...readAttribution(), ...current }
  if (Object.keys(attribution).length > 0) {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution))
  }
  return attribution
}

const gaEventNames: Record<string, string> = {
  ViewContent: 'view_item',
  Lead: 'sign_up',
  InitiateCheckout: 'begin_checkout',
  AddPaymentInfo: 'add_payment_info',
  Purchase: 'purchase',
  DiagnosticClick: 'diagnostic_click',
  ArticleCtaClick: 'article_cta_click',
}

const ymGoalNames: Record<string, string> = {
  ViewContent: 'view_content',
  Lead: 'sign_up',
  InitiateCheckout: 'begin_checkout',
  AddPaymentInfo: 'add_payment_info',
  Purchase: 'purchase',
  DiagnosticClick: 'diagnostic_click',
  ArticleCtaClick: 'article_cta_click',
}

function gaParams(params: Record<string, unknown> = {}): Record<string, unknown> {
  const contentIds = Array.isArray(params.content_ids) ? params.content_ids : []
  const contentName = typeof params.content_name === 'string' ? params.content_name : undefined
  const category = typeof params.content_category === 'string' ? params.content_category : undefined
  const value = typeof params.value === 'number' ? params.value : undefined
  const currency = typeof params.currency === 'string' ? params.currency : undefined

  return {
    ...params,
    ...captureAttribution(),
    ...(contentName || contentIds.length > 0 ? {
      items: [{
        item_id: String(contentIds[0] ?? contentName ?? ''),
        item_name: contentName,
        item_category: category,
        price: value,
        quantity: 1,
      }],
    } : {}),
    ...(value != null ? { value } : {}),
    ...(currency ? { currency } : {}),
  }
}

/**
 * Standard Meta Pixel event (matches a built-in like 'ViewContent', 'Lead', 'Purchase').
 * https://developers.facebook.com/docs/meta-pixel/reference
 */
export function track(event: string, params?: Record<string, unknown>): void {
  if (!hasMarketingConsent()) return

  const enriched = gaParams(params)
  window.gtag?.('event', gaEventNames[event] ?? event, enriched)
  window.ym?.(YM_ID, 'reachGoal', ymGoalNames[event] ?? event, enriched)

  const fn = fbq()
  fn?.('track', event, enriched)
}

/**
 * Custom event name (anything not in the standard list, e.g. 'PDF Download').
 */
export function trackCustom(event: string, params?: Record<string, unknown>): void {
  if (!hasMarketingConsent()) return
  const enriched = { ...params, ...captureAttribution() }
  window.gtag?.('event', event, enriched)
  window.ym?.(YM_ID, 'reachGoal', event, enriched)
  const fn = fbq()
  fn?.('trackCustom', event, enriched)
}

export function trackPageView(): void {
  if (typeof window === 'undefined' || !hasMarketingConsent()) return
  const attribution = captureAttribution()
  const page = {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    ...attribution,
  }
  window.gtag?.('event', 'page_view', page)
  window.ym?.(YM_ID, 'hit', window.location.href, {
    title: document.title,
    params: attribution,
  })
  fbq()?.('track', 'PageView', attribution)
}

/**
 * True iff Pixel has been initialised in this tab — useful to avoid calling
 * `track` before the script finishes loading (it queues by default, but explicit
 * checks help when debugging).
 */
export function pixelReady(): boolean {
  return typeof window !== 'undefined' && Boolean(window.fbq) && hasMarketingConsent()
}
