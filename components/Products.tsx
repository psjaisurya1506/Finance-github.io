'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { inr, products, type Category } from '@/lib/data'

const cats: Category[] = ['Invest', 'Borrow', 'Protect', 'Bank']
const blurb: Record<Category, string> = {
  Invest: 'Grow wealth with market-linked and fixed-income options.',
  Borrow: 'Clear pricing, fast decisions, no hidden charges.',
  Protect: 'Cover that keeps your family’s plans safe.',
  Bank: 'Everyday banking with zero-fee transfers and strong controls.',
}

export default function Products({ onApply }: { onApply: (id: string) => void }) {
  const [cat, setCat] = useState<Category>('Invest')
  const list = products.filter(p => p.category === cat)
  return <section id="products" className="mx-auto max-w-7xl px-6 py-24">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="eyebrow">Products</p><h2 className="section-title">Everything you need, in one place.</h2><p className="section-copy">{blurb[cat]}</p></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Product category">{cats.map(c => <button key={c} className="chip !px-5 !py-2.5 !text-[13px]" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
    </div>
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">{list.map((p, i) => { const Icon = p.icon; return <motion.article key={p.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ delay: i * .05 }} className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-gold/30">
        <div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold"><Icon className="h-5 w-5" /></div>{p.popular && <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-2">Popular</span>}</div>
        <h3 className="font-display mt-6 text-xl text-paper">{p.name}</h3>
        <p className="mt-2 text-[13px] leading-6 text-slate-400">{p.tagline}</p>
        <div className="mt-5 flex items-baseline gap-2 border-y border-white/10 py-4"><span className="font-display text-3xl text-gold-gradient">{p.headline}</span><span className="text-[11px] uppercase tracking-wide text-slate-500">{p.headlineLabel}</span></div>
        <ul className="mt-5 space-y-2.5">{p.features.map(f => <li key={f} className="flex gap-2.5 text-[13px] leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{f}</li>)}</ul>
        <div className="mt-auto pt-6"><button onClick={() => onApply(p.id)} className="btn-gold w-full !py-3 !text-[13px]">{p.kind === 'loan' ? 'Check eligibility' : p.kind === 'invest' ? 'Start investing' : p.kind === 'insure' ? 'Get a quote' : 'Open now'} <ArrowRight className="h-4 w-4" /></button>{p.min > 0 && <p className="mt-2 text-center text-[11px] text-slate-600">{p.kind === 'insure' ? 'Cover from' : 'From'} {inr(p.min, true)}</p>}</div>
      </motion.article> })}</AnimatePresence>
    </div>
    <p className="mt-8 text-[11px] leading-5 text-slate-600">*Rates, returns and premiums are indicative sample figures for this demo. Market-linked investments carry risk; read all scheme documents carefully. Loans are subject to credit approval.</p>
  </section>
}
