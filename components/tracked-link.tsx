'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { trackCustom } from '@/lib/analytics'

interface Props {
  href: string
  eventName: string
  eventParams?: Record<string, unknown>
  className?: string
  target?: string
  rel?: string
  children: ReactNode
}

export default function TrackedLink({
  href,
  eventName,
  eventParams,
  className,
  target,
  rel,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => trackCustom(eventName, eventParams)}
    >
      {children}
    </Link>
  )
}
