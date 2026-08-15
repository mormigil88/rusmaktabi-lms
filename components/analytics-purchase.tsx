'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

interface Props {
  transactionId: string
  contentName: string
  contentIds: string[]
  value: number
  currency: 'UZS' | 'RUB'
}

/**
 * Fires Meta Pixel `Purchase` once on mount. Renders nothing.
 * Should be placed only on the post-payment success page, after server-side
 * verification that the enrollment is active (otherwise we'd over-report).
 */
export default function AnalyticsPurchase({ transactionId, contentName, contentIds, value, currency }: Props) {
  useEffect(() => {
    track('Purchase', {
      transaction_id: transactionId,
      content_name: contentName,
      content_ids: contentIds,
      content_type: 'product',
      value,
      currency,
    })
  }, [transactionId, contentName, contentIds, value, currency])
  return null
}
