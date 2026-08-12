'use client'

import { RESET_COOKIE_EVENT } from './cookie-banner'

export default function CookieSettingsButton() {
  function onClick() {
    window.dispatchEvent(new Event(RESET_COOKIE_EVENT))
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-brand-700/70 hover:text-brand-600 transition-colors duration-150 cursor-pointer"
    >
      Cookie
    </button>
  )
}
