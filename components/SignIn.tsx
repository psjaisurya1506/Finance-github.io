'use client'

import { FormEvent, useState } from 'react'
import { X } from 'lucide-react'
import type { User } from '@/lib/store'

export default function SignIn({ onClose, onSignIn }: { onClose: () => void; onSignIn: (u: User) => void }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [touched, setTouched] = useState(false)
  const bad = { name: name.trim().length < 2, email: !/^\S+@\S+\.\S+$/.test(email) }
  const submit = (e: FormEvent) => { e.preventDefault(); setTouched(true); if (bad.name || bad.email) return; onSignIn({ name: name.trim(), email: email.trim() }) }
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label="Client login" onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-2 p-7 shadow-2xl">
      <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Demo access</p><h3 className="font-display mt-1 text-2xl text-paper">Client login</h3></div><button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 hover:text-paper"><X className="h-5 w-5" /></button></div>
      <p className="mt-3 text-[13px] leading-6 text-slate-500">This demo has no real accounts. Enter a name and email to personalise the dashboard with sample data. No password is needed or stored.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <label className="block"><span className="field-label">Full name</span><input autoFocus aria-invalid={touched && bad.name} className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
        <label className="block"><span className="field-label">Email</span><input type="email" aria-invalid={touched && bad.email} className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
        {touched && (bad.name || bad.email) && <p role="alert" className="text-[11px] text-rose">Enter your name and a valid email.</p>}
        <button className="btn-gold w-full">Continue to dashboard</button>
      </form>
    </div>
  </div>
}
