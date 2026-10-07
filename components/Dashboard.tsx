'use client'

import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, LogIn, Plus } from 'lucide-react'
import { goals, holdings, inr, monthsShort, netWorthSeries, transactions } from '@/lib/data'
import type { User } from '@/lib/store'
import { AreaLine, Donut } from './charts'

export default function Dashboard({ user, onSignIn, onOpen }: { user: User | null; onSignIn: () => void; onOpen: () => void }) {
  const [hide, setHide] = useState(false)
  const total = useMemo(() => holdings.reduce((a, h) => a + h.value, 0), [])
  const byClass = useMemo(() => {
    const m = new Map<string, { value: number; color: string }>()
    holdings.forEach(h => { const e = m.get(h.cls); m.set(h.cls, { value: (e?.value ?? 0) + h.value, color: e?.color ?? h.color }) })
    return [...m.entries()].map(([label, v]) => ({ label, ...v }))
  }, [])
  const dayChange = holdings.reduce((a, h) => a + (h.value * h.day) / 100, 0)
  const mask = (s: string) => hide ? '••••••' : s

  return <section id="dashboard" className="border-y border-white/10 bg-ink-2 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div><p className="eyebrow">Client dashboard</p><h2 className="section-title">{user ? `Welcome back, ${user.name.split(' ')[0]}.` : 'See your whole financial life.'}</h2><p className="section-copy">{user ? 'Here is a snapshot of your portfolio, goals and cash flow. Figures are sample data for the demo.' : 'A preview of the Fermor client dashboard with sample data. Sign in to personalise it.'}</p></div>
        <div className="flex gap-3">
          <button onClick={() => setHide(!hide)} className="btn-ghost !py-2.5 !text-[13px]" aria-pressed={hide}>{hide ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{hide ? 'Show balances' : 'Hide balances'}</button>
          {!user && <button onClick={onSignIn} className="btn-gold !py-2.5 !text-[13px]"><LogIn className="h-4 w-4" />Client login</button>}
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Total net worth</p>
          <div className="mt-2 flex flex-wrap items-end gap-4"><p className="font-display text-5xl text-paper">{mask(inr(total))}</p><p className={`pb-1.5 text-sm font-semibold ${dayChange >= 0 ? 'text-mint' : 'text-rose'}`}>{mask(`${dayChange >= 0 ? '+' : ''}${inr(dayChange)}`)} today</p></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4"><AreaLine data={netWorthSeries} labels={monthsShort} /><p className="mt-1 text-[11px] text-slate-600">Net worth, last 12 months (₹ lakh, sample)</p></div>
        </div>
        <div className="card flex flex-col items-center p-6">
          <p className="self-start text-[11px] font-bold uppercase tracking-[.18em] text-gold">Allocation</p>
          <div className="mt-4"><Donut parts={byClass} center={<><p className="text-[10px] uppercase tracking-wider text-slate-500">Equity</p><p className="font-display text-2xl text-paper">{Math.round((byClass.find(b => b.label === 'Equity')!.value / total) * 100)}%</p></>} /></div>
          <ul className="mt-5 grid w-full grid-cols-2 gap-2.5">{byClass.map(b => <li key={b.label} className="flex items-center justify-between text-xs text-slate-300"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: b.color }} />{b.label}</span><span className="text-slate-500">{Math.round((b.value / total) * 100)}%</span></li>)}</ul>
        </div>

        <div className="card overflow-x-auto p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Holdings</p><button onClick={onOpen} className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"><Plus className="h-3.5 w-3.5" />Add investment</button></div>
          <table className="mt-4 w-full min-w-[460px] text-left text-sm"><thead><tr className="text-[11px] uppercase tracking-wider text-slate-500"><th className="pb-3 font-semibold">Asset</th><th className="pb-3 text-right font-semibold">Value</th><th className="pb-3 text-right font-semibold">Weight</th><th className="pb-3 text-right font-semibold">1D</th></tr></thead>
            <tbody>{holdings.map(h => <tr key={h.name} className="border-t border-white/5"><td className="py-3.5"><span className="flex items-center gap-3"><span className="h-8 w-1 rounded-full" style={{ background: h.color }} /><span><span className="block font-medium text-paper">{h.name}</span><span className="text-[11px] text-slate-500">{h.cls}</span></span></span></td><td className="py-3.5 text-right text-paper">{mask(inr(h.value))}</td><td className="py-3.5 text-right text-slate-400">{((h.value / total) * 100).toFixed(1)}%</td><td className={`py-3.5 text-right font-semibold ${h.day >= 0 ? 'text-mint' : 'text-rose'}`}>{h.day >= 0 ? '+' : ''}{h.day.toFixed(2)}%</td></tr>)}</tbody></table>
        </div>
        <div className="card p-6">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Goals</p>
          <div className="mt-5 space-y-6">{goals.map(g => { const pct = Math.round((g.saved / g.target) * 100); return <div key={g.name}><div className="flex justify-between text-sm"><span className="font-medium text-paper">{g.name}</span><span className="text-gold-2">{pct}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={g.name}><div className="h-full rounded-full bg-gradient-to-r from-gold to-mint" style={{ width: `${pct}%` }} /></div><p className="mt-1.5 text-[11px] text-slate-500">{mask(inr(g.saved, true))} of {mask(inr(g.target, true))} · by {g.by}</p></div> })}</div>
        </div>

        <div className="card p-6 lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Recent activity</p>
          <ul className="mt-4 grid gap-x-10 md:grid-cols-2">{transactions.map(t => <li key={t.t + t.d} className="flex items-center justify-between border-b border-white/5 py-3.5"><span className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${t.a >= 0 ? 'bg-mint/10 text-mint' : 'bg-white/5 text-slate-400'}`}>{t.a >= 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><span><span className="block text-sm text-paper">{t.t}</span><span className="text-[11px] text-slate-500">{t.d}</span></span></span><span className={`text-sm font-semibold ${t.a >= 0 ? 'text-mint' : 'text-paper'}`}>{mask(`${t.a >= 0 ? '+' : '−'}${inr(Math.abs(t.a))}`)}</span></li>)}</ul>
        </div>
      </div>
    </div>
  </section>
}
