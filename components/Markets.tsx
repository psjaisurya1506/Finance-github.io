'use client'

import { useMemo, useState } from 'react'
import { ArrowDownUp, Search, Star } from 'lucide-react'
import { quotes } from '@/lib/data'
import { Sparkline } from './charts'

type Sort = 'default' | 'chg-desc' | 'chg-asc' | 'price'
const types = ['All', 'Index', 'Equity', 'Fund', 'Commodity', 'Watchlist'] as const

export default function Markets({ watch, toggleWatch }: { watch: string[]; toggleWatch: (s: string) => void }) {
  const [type, setType] = useState<(typeof types)[number]>('All')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('default')
  const list = useMemo(() => {
    let out = quotes.filter(x => (type === 'All' || (type === 'Watchlist' ? watch.includes(x.sym) : x.type === type)) && (!q || `${x.sym} ${x.name}`.toLowerCase().includes(q.toLowerCase())))
    out = [...out]
    if (sort === 'chg-desc') out.sort((a, b) => b.chg - a.chg); if (sort === 'chg-asc') out.sort((a, b) => a.chg - b.chg); if (sort === 'price') out.sort((a, b) => b.price - a.price)
    return out
  }, [type, q, sort, watch])
  const adv = quotes.filter(x => x.chg > 0).length

  return <section id="markets" className="mx-auto max-w-7xl px-6 py-24">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="eyebrow">Markets</p><h2 className="section-title">Your watchlist, at a glance.</h2><p className="section-copy">Sample quotes for indices, stocks, funds and commodities. Star instruments to build a watchlist that is saved on this device.</p></div>
      <div className="relative w-full lg:max-w-xs"><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><input aria-label="Search instruments" value={q} onChange={e => setQ(e.target.value)} placeholder="Search symbol or name" className="input-field pl-10" /></div>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {quotes.slice(0, 3).map(i => <div key={i.sym} className="card flex items-center justify-between p-5"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{i.name}</p><p className="font-display mt-1 text-2xl text-paper">{i.price.toLocaleString('en-IN')}</p><p className={`mt-1 text-xs font-semibold ${i.chg >= 0 ? 'text-mint' : 'text-rose'}`}>{i.chg >= 0 ? '▲' : '▼'} {Math.abs(i.chg).toFixed(2)}%</p></div><Sparkline data={i.spark} up={i.chg >= 0} w={110} h={44} /></div>)}
    </div>

    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Instrument type">{types.map(t => <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>{t}{t === 'Watchlist' && ` (${watch.length})`}</button>)}</div>
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><ArrowDownUp className="h-3.5 w-3.5" />Sort<select value={sort} onChange={e => setSort(e.target.value as Sort)} className="input-field !w-auto !py-2 !text-xs"><option value="default">Default</option><option value="chg-desc">Top gainers</option><option value="chg-asc">Top losers</option><option value="price">Price</option></select></label>
    </div>

    <div className="card mt-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><th className="w-12 p-4" /><th className="p-4 font-semibold">Instrument</th><th className="p-4 text-right font-semibold">Price</th><th className="p-4 text-right font-semibold">Change</th><th className="hidden p-4 text-right font-semibold sm:table-cell">30 days</th></tr></thead>
        <tbody>{list.map(x => { const on = watch.includes(x.sym); return <tr key={x.sym} className="border-b border-white/5 transition hover:bg-white/[.025]">
          <td className="p-4"><button onClick={() => toggleWatch(x.sym)} aria-pressed={on} aria-label={`${on ? 'Remove' : 'Add'} ${x.sym} ${on ? 'from' : 'to'} watchlist`} className={on ? 'text-gold' : 'text-slate-600 hover:text-paper'}><Star className="h-4 w-4" fill={on ? 'currentColor' : 'none'} /></button></td>
          <td className="p-4"><p className="font-semibold text-paper">{x.sym}</p><p className="text-xs text-slate-500">{x.name} · {x.type}</p></td>
          <td className="p-4 text-right font-medium text-paper">{x.price.toLocaleString('en-IN')}</td>
          <td className={`p-4 text-right font-semibold ${x.chg >= 0 ? 'text-mint' : 'text-rose'}`}>{x.chg >= 0 ? '+' : ''}{x.chg.toFixed(2)}%</td>
          <td className="hidden p-4 sm:table-cell"><div className="flex justify-end"><Sparkline data={x.spark} up={x.chg >= 0} /></div></td></tr> })}
          {list.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-sm text-slate-500">{type === 'Watchlist' ? 'Your watchlist is empty. Star an instrument to add it.' : 'No instruments match.'}</td></tr>}</tbody>
      </table>
    </div>
    <p className="mt-4 text-[11px] text-slate-600">Breadth: {adv} advancing / {quotes.length - adv} declining. All quotes are static sample data for demonstration — not live prices and not investment advice.</p>
  </section>
}
