'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

interface Props {
  contentName: string
  contentCategory: string
  value?: number
  currency?: string
}

/**
 * Fires Meta Pixel `ViewContent` once when the component mounts. Renders nothing.
 * Safe to drop into any server page.
 */
export default function AnalyticsViewContent({
  contentName,
  contentCategory,
  value,
  currency = 'UZS',
}: Props) {
  useEffect(() => {
    track('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      ...(value != null ? { value, currency } : {}),
    })
  }, [contentName, contentCategory, value, currency])
  return null
}
