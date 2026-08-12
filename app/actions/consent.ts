'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function revokeMarketingConsent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Tizimga kirilmagan')

  const { error } = await supabase.auth.updateUser({
    data: {
      marketing_consent: false,
      marketing_consent_revoked_at: new Date().toISOString(),
    },
  })
  if (error) throw new Error(error.message)

  revalidatePath('/account/privacy')
}

export async function grantMarketingConsent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Tizimga kirilmagan')

  const { error } = await supabase.auth.updateUser({
    data: {
      marketing_consent: true,
      marketing_consent_at: new Date().toISOString(),
      marketing_consent_revoked_at: null,
    },
  })
  if (error) throw new Error(error.message)

  revalidatePath('/account/privacy')
}
