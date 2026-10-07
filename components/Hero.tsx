'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'
import { netWorthSeries, quotes } from '@/lib/data'
import { AreaLine } from './charts'

function Counter({ to, prefix = '', suffix = '', decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: x => setV(x) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

export default function Hero({ onOpen }: { onOpen: () => void }) {
  const tick = quotes.slice(0, 9)
  return <section id="top" className="relative overflow-hidden border-b border-white/10 pt-[68px]">
    <div className="hero-grid absolute inset-0" />
    <div className="absolute -left-20 top-24 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
    <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-mint/10 blur-[130px]" />

    <div className="relative border-b border-white/10 bg-black/20 py-2.5" aria-label="Sample market data">
      <div className="flex overflow-hidden whitespace-nowrap"><div className="marquee flex shrink-0 gap-10 pr-10">{[...tick, ...tick].map((t, i) => <span key={i} className="flex items-center gap-2 text-[12px]"><span className="font-semibold tracking-wide text-slate-400">{t.sym}</span><span className="text-paper">{t.price.toLocaleString('en-IN')}</span><span className={t.chg >= 0 ? 'text-mint' : 'text-rose'}>{t.chg >= 0 ? '▲' : '▼'} {Math.abs(t.chg).toFixed(2)}%</span></span>)}</div></div>
    </div>

    <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
      <div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> Investing · Lending · Insurance · Banking</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="font-display max-w-3xl text-5xl font-medium leading-[1.03] text-paper sm:text-6xl lg:text-7xl">Every financial goal, <span className="text-gold-gradient">one trusted home.</span></motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">Grow your savings, borrow with clarity, protect your family and bank with confidence — all from a single, secure Fermor account.</motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button onClick={onOpen} className="btn-gold group">Open an account <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button>
          <a href="#calculators" className="btn-ghost">Plan with calculators</a>
        </motion.div>
        <div className="mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[[<Counter key="a" to={48200} prefix="₹" suffix=" Cr" />, 'assets managed'], [<Counter key="b" to={2.4} suffix="M+" decimals={1} />, 'happy clients'], [<Counter key="c" to={8.5} suffix="%" decimals={2} />, 'loans from p.a.*'], [<Counter key="d" to={99.98} suffix="%" decimals={2} />, 'platform uptime']].map(([v, l], i) => <div key={i}><p className="font-display text-2xl text-paper">{v}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{l as string}</p></div>)}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: .97, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .2 }} className="card relative p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Net worth · sample</p><p className="font-display mt-2 text-4xl text-paper">₹20.0 L</p></div><span className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-bold text-mint"><TrendingUp className="h-3 w-3" /> +29.9% / 12m</span></div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4"><AreaLine data={netWorthSeries} height={110} /></div>
        <div className="mt-4 grid grid-cols-3 gap-3">{[['SIP', '₹15,000'], ['Loan EMI', '₹38,250'], ['FD interest', '₹5,430']].map(([k, v]) => <div key={k} className="rounded-2xl border border-white/10 bg-white/[.025] p-3.5"><p className="text-[10px] uppercase tracking-wide text-slate-500">{k}</p><p className="font-display mt-1 text-lg text-paper">{v}</p></div>)}</div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gold/15 bg-gold/5 p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-gold" /><p className="text-xs leading-5 text-slate-300">Bank-grade encryption, device binding and real-time fraud monitoring on every login and payment.</p></div>
      </motion.div>
    </div>
  </section>
}
