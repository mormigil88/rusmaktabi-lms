'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ProfileFormProps {
  userId: string
  initialName: string
  initialPhone: string
  initialCountry: string
}

export default function ProfileForm({ userId, initialName, initialPhone, initialCountry }: ProfileFormProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [country, setCountry] = useState(initialCountry)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await (supabase
      .from('users')
      .update({ name, phone, country } as never)
      .eq('id', userId))
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{name || '—'}</div>
          <div className="text-sm text-brand-700/60">{phone || 'Telefon yo\'q'}</div>
          <div className="text-xs text-brand-600/50 uppercase tracking-wide">{country}</div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer transition-colors duration-150"
        >
          {saved ? '✓ Saqlandi' : 'Tahrirlash'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Ism</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          placeholder="Ism va familiya"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Telefon</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          placeholder="+998 90 000 00 00"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Mamlakat</label>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition cursor-pointer"
        >
          <option value="UZ">O'zbekiston</option>
          <option value="RU">Rossiya</option>
          <option value="KZ">Qozog'iston</option>
          <option value="OTHER">Boshqa</option>
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-4 text-sm text-brand-700/60 hover:text-brand-700 cursor-pointer transition-colors duration-150"
        >
          Bekor
        </button>
      </div>
    </div>
  )
}
