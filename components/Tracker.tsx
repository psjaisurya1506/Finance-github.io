'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Inbox, Search, Trash2 } from 'lucide-react'
import { inr, stages } from '@/lib/data'
import type { Application } from '@/lib/store'

export default function Tracker({ apps, advance, remove }: { apps: Application[]; advance: (ref: string) => void; remove: (ref: string) => void }) {
  const [q, setQ] = useState('')
  const [searched, setSearched] = useState<string | null>(null)
  const shown = searched ? apps.filter(a => a.ref.toLowerCase() === searched.toLowerCase() || a.email.toLowerCase() === searched.toLowerCase()) : apps

  return <section id="track" className="mx-auto max-w-7xl px-6 py-24">
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div><p className="eyebrow">Application tracker</p><h2 className="section-title">Know where you stand.</h2><p className="section-copy">Look up an application by reference ID or email. Applications submitted on this device appear automatically.</p></div>
      <form onSubmit={e => { e.preventDefault(); setSearched(q.trim() || null) }} className="flex w-full gap-2 md:max-w-md">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><input value={q} onChange={e => { setQ(e.target.value); if (!e.target.value) setSearched(null) }} placeholder="FRM-L-48213 or email" aria-label="Reference ID or email" className="input-field pl-10" /></div>
        <button className="btn-gold !px-5">Look up</button>
      </form>
    </div>
    <div className="mt-10 space-y-5">
      {shown.length === 0 && <div className="card flex flex-col items-center p-12 text-center"><Inbox className="h-8 w-8 text-slate-600" /><p className="mt-4 text-sm font-semibold text-paper">{searched ? 'No application found' : 'No applications yet'}</p><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{searched ? 'Check the reference ID or email and try again.' : 'Open an account or apply for a loan above and it will appear here with live status.'}</p></div>}
      {shown.map(a => <div key={a.ref} className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="font-mono text-xs font-semibold tracking-wider text-gold">{a.ref}</p><h3 className="font-display mt-1 text-xl text-paper">{a.productName}{a.amount > 0 && <span className="text-slate-500"> · {inr(a.amount, true)}</span>}</h3><p className="mt-1 text-xs text-slate-500">{a.name} · submitted {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${a.stage >= 4 ? 'bg-mint/15 text-mint' : 'bg-gold/15 text-gold-2'}`}>{stages[a.stage].label}</span>
        </div>
        <ol className="mt-7 grid gap-3 md:grid-cols-5">{stages.map((s, i) => <li key={s.key} className="flex items-start gap-3 md:flex-col md:gap-2">
          <div className="flex items-center gap-2 md:w-full">{i <= a.stage ? <CheckCircle2 className="h-5 w-5 shrink-0 text-mint" /> : <Circle className="h-5 w-5 shrink-0 text-slate-700" />}{i < stages.length - 1 && <div className={`hidden h-px flex-1 md:block ${i < a.stage ? 'bg-mint/50' : 'bg-white/10'}`} />}</div>
          <div><p className={`text-xs font-semibold ${i <= a.stage ? 'text-paper' : 'text-slate-600'}`}>{s.label}</p>{i === a.stage && <p className="mt-1 text-[11px] leading-4 text-slate-500">{s.note}</p>}</div>
        </li>)}</ol>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          <button disabled={a.stage >= stages.length - 1} onClick={() => advance(a.ref)} className="btn-ghost !px-4 !py-2 !text-xs">Demo: advance stage</button>
          <button onClick={() => remove(a.ref)} className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-rose"><Trash2 className="h-3.5 w-3.5" /> Cancel application</button>
        </div>
      </div>)}
    </div>
  </section>
}
