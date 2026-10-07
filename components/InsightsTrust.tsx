'use client'

import { useState } from 'react'
import { ArrowUpRight, Fingerprint, Headset, Lock, ScanEye, ShieldCheck } from 'lucide-react'
import { insights } from '@/lib/data'

const cats = ['All', 'Investing', 'Borrowing', 'Protection', 'Planning'] as const
const trust = [
  [Lock, 'End-to-end encryption', 'Data encrypted in transit and at rest with regular third-party penetration tests.'],
  [Fingerprint, 'Device binding & biometrics', 'Sensitive actions need step-up authentication on a registered device.'],
  [ScanEye, 'Real-time fraud monitoring', 'Behavioural analytics flag unusual activity and pause risky payments.'],
  [Headset, 'Human help, always', '24×7 support with a dedicated grievance officer and clear escalation path.'],
] as const

export default function InsightsTrust() {
  const [c, setC] = useState<(typeof cats)[number]>('All')
  const list = insights.filter(i => c === 'All' || i.cat === c)
  return <>
    <section id="insights" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">Insights</p><h2 className="section-title">Money, explained clearly.</h2><p className="section-copy">Practical guides from our research and advisory teams — no jargon, no hype.</p></div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Topic">{cats.map(x => <button key={x} className="chip" aria-pressed={c === x} onClick={() => setC(x)}>{x}</button>)}</div></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map(a => <article key={a.title} className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-gold/30">
        <div className="flex items-center justify-between text-[11px]"><span className="font-bold uppercase tracking-wider text-mint">{a.cat}</span><span className="text-slate-500">{a.mins} min read</span></div>
        <h3 className="font-display mt-4 text-xl leading-snug text-paper">{a.title}</h3><p className="mt-3 flex-1 text-[13px] leading-6 text-slate-400">{a.blurb}</p>
        <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-gold">Read guide <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </article>)}</div>
    </section>

    <section id="security" className="border-y border-white/10 bg-ink-2 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl"><p className="eyebrow">Security & trust</p><h2 className="section-title">Built to protect what matters.</h2><p className="section-copy">Security is part of every release, not an afterthought.</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{trust.map(([Icon, t, d]) => <div key={t} className="card p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold"><Icon className="h-5 w-5" /></div><h3 className="font-display mt-5 text-lg text-paper">{t}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{d}</p></div>)}</div>
        <p className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/15 bg-gold/5 p-5 text-xs leading-6 text-slate-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />Fermor will never ask for your PIN, OTP, CVV or password by phone, SMS, email or chat. If in doubt, hang up and use the official app or website.</p>
      </div>
    </section>
  </>
}
