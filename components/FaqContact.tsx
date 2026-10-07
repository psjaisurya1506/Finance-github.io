'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, Loader2, Mail, Send } from 'lucide-react'
import { faqs } from '@/lib/data'

export default function FaqContact() {
  const [open, setOpen] = useState<number | null>(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [f, setF] = useState({ name: '', email: '', topic: 'Accounts', message: '' })
  const valid = f.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(f.email) && f.message.trim().length > 9
  return <section id="faq" className="mx-auto max-w-7xl px-6 py-24">
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Frequently asked</p><h2 className="section-title">Questions, answered.</h2>
        <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[.02] px-6">{faqs.map(([q, a], i) => <div key={q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-paper"><span>{q}</span><ChevronDown className={`h-4 w-4 shrink-0 text-gold transition ${open === i ? 'rotate-180' : ''}`} /></button>
          <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden"><p className="pb-5 pr-6 text-[13px] leading-6 text-slate-400">{a}</p></motion.div></div>)}</div>
      </div>
      <div id="contact" className="card self-start p-8">
        <Mail className="h-6 w-6 text-gold" /><h3 className="font-display mt-4 text-2xl text-paper">Talk to a Fermor advisor</h3>
        <p className="mt-2 text-[13px] leading-6 text-slate-500">Questions about products, rates or your application? We reply within one working day.</p>
        {status === 'success' ? <div className="mt-8 rounded-2xl border border-mint/25 bg-mint/10 p-6 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-mint" /><p className="mt-3 font-semibold text-paper">Message sent</p><p className="mt-1 text-xs text-slate-400">Demo only — connect this form to your CRM or email service.</p><button onClick={() => { setStatus('idle'); setF({ name: '', email: '', topic: 'Accounts', message: '' }) }} className="mt-4 text-xs font-semibold text-gold hover:underline">Send another</button></div> :
          <form className="mt-6 space-y-4" onSubmit={e => { e.preventDefault(); if (!valid) return; setStatus('loading'); setTimeout(() => setStatus('success'), 1000) }}>
            <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">Name</span><input className="input-field" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Your name" /></label><label><span className="field-label">Email</span><input type="email" className="input-field" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" /></label></div>
            <label className="block"><span className="field-label">Topic</span><select className="input-field" value={f.topic} onChange={e => setF({ ...f, topic: e.target.value })}>{['Accounts', 'Investments', 'Loans', 'Insurance', 'Card & payments', 'Grievance', 'Other'].map(t => <option key={t}>{t}</option>)}</select></label>
            <label className="block"><span className="field-label">Message</span><textarea rows={4} className="input-field resize-none" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} placeholder="How can we help? (min. 10 characters)" /></label>
            <p className="text-[11px] text-slate-600">Please do not include PINs, OTPs or full card numbers.</p>
            <button disabled={!valid || status === 'loading'} className="btn-gold w-full">{status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Send message <Send className="h-4 w-4" /></>}</button>
          </form>}
      </div>
    </div>
  </section>
}
