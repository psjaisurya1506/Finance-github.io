'use client'

import { useMemo, useState } from 'react'
import { inr } from '@/lib/data'
import { StackedBars } from './charts'

type Tab = 'sip' | 'emi' | 'fd' | 'goal'
const tabs: [Tab, string][] = [['sip', 'SIP'], ['emi', 'Loan EMI'], ['fd', 'Fixed deposit'], ['goal', 'Goal planner']]

function Slider({ label, value, onChange, min, max, step, fmt }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string }) {
  return <label className="block"><span className="flex items-center justify-between text-xs font-semibold text-slate-300"><span>{label}</span><span className="rounded-lg border border-white/10 bg-black/25 px-3 py-1 font-display text-sm text-gold-2">{fmt(value)}</span></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} className="mt-3" aria-label={label} /></label>
}
const Stat = ({ k, v, accent }: { k: string; v: string; accent?: boolean }) => <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-500">{k}</p><p className={`font-display mt-1.5 text-xl ${accent ? 'text-gold-gradient' : 'text-paper'}`}>{v}</p></div>
const Legend = ({ items }: { items: [string, string][] }) => <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-400">{items.map(([c, l]) => <span key={l} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>)}</div>

function sipYears(p: number, rate: number, years: number, stepUp: number) {
  const i = rate / 12 / 100; let bal = 0, inv = 0, m = p
  const rows: { label: string; a: number; b: number }[] = []
  for (let y = 1; y <= years; y++) {
    for (let k = 0; k < 12; k++) { bal = (bal + m) * (1 + i); inv += m }
    rows.push({ label: `Y${y}`, a: inv, b: bal - inv })
    m *= 1 + stepUp / 100
  }
  return { rows, bal, inv }
}

function SIP() {
  const [p, setP] = useState(15000); const [r, setR] = useState(12); const [y, setY] = useState(15); const [s, setS] = useState(5)
  const d = useMemo(() => sipYears(p, r, y, s), [p, r, y, s])
  return <Panel left={<>
    <Slider label="Monthly investment" value={p} onChange={setP} min={500} max={200000} step={500} fmt={inr} />
    <Slider label="Expected return (p.a.)" value={r} onChange={setR} min={4} max={18} step={0.5} fmt={n => n + '%'} />
    <Slider label="Time period" value={y} onChange={setY} min={1} max={35} step={1} fmt={n => n + ' yrs'} />
    <Slider label="Annual step-up" value={s} onChange={setS} min={0} max={20} step={1} fmt={n => n + '%'} />
  </>} right={<>
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Projected value</p><p className="font-display text-5xl text-gold-gradient">{inr(d.bal)}</p>
    <div className="mt-5 grid grid-cols-2 gap-3"><Stat k="Total invested" v={inr(d.inv, true)} /><Stat k="Estimated returns" v={inr(d.bal - d.inv, true)} /></div>
    <div className="mt-6"><StackedBars data={d.rows} /><Legend items={[['#3ddc97', 'Invested'], ['#e4b95e', 'Returns']]} /></div>
  </>} />
}

function EMI() {
  const [p, setP] = useState(4500000); const [r, setR] = useState(8.5); const [y, setY] = useState(20)
  const d = useMemo(() => {
    const i = r / 12 / 100, n = y * 12
    const emi = (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
    let bal = p; const rows: { label: string; a: number; b: number }[] = []; let cumP = 0, cumI = 0
    for (let k = 1; k <= n; k++) { const int = bal * i; const pr = emi - int; bal -= pr; cumP += pr; cumI += int; if (k % 12 === 0) rows.push({ label: `Y${k / 12}`, a: cumP, b: cumI }) }
    return { emi, total: emi * n, interest: emi * n - p, rows }
  }, [p, r, y])
  return <Panel left={<>
    <Slider label="Loan amount" value={p} onChange={setP} min={100000} max={20000000} step={50000} fmt={n => inr(n, true)} />
    <Slider label="Interest rate (p.a.)" value={r} onChange={setR} min={6} max={20} step={0.05} fmt={n => n.toFixed(2) + '%'} />
    <Slider label="Tenure" value={y} onChange={setY} min={1} max={30} step={1} fmt={n => n + ' yrs'} />
  </>} right={<>
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Monthly EMI</p><p className="font-display text-5xl text-gold-gradient">{inr(d.emi)}</p>
    <div className="mt-5 grid grid-cols-2 gap-3"><Stat k="Total interest" v={inr(d.interest, true)} /><Stat k="Total payable" v={inr(d.total, true)} /></div>
    <div className="mt-6"><StackedBars data={d.rows} /><Legend items={[['#3ddc97', 'Principal repaid (cumulative)'], ['#e4b95e', 'Interest paid (cumulative)']]} /></div>
    <p className="mt-3 text-[11px] text-slate-600">Interest share of total payment: {((d.interest / d.total) * 100).toFixed(1)}%</p>
  </>} />
}

function FD() {
  const [p, setP] = useState(500000); const [r, setR] = useState(7.25); const [y, setY] = useState(5); const [sr, setSr] = useState(false)
  const d = useMemo(() => {
    const rate = r + (sr ? 0.5 : 0)
    const rows = Array.from({ length: y }, (_, k) => { const v = p * Math.pow(1 + rate / 400, 4 * (k + 1)); return { label: `Y${k + 1}`, a: p, b: v - p } })
    const mat = p * Math.pow(1 + rate / 400, 4 * y)
    return { rows, mat, rate }
  }, [p, r, y, sr])
  return <Panel left={<>
    <Slider label="Deposit amount" value={p} onChange={setP} min={10000} max={10000000} step={10000} fmt={n => inr(n, true)} />
    <Slider label="Interest rate (p.a.)" value={r} onChange={setR} min={4} max={9} step={0.05} fmt={n => n.toFixed(2) + '%'} />
    <Slider label="Tenure" value={y} onChange={setY} min={1} max={10} step={1} fmt={n => n + ' yrs'} />
    <button type="button" className="chip" aria-pressed={sr} onClick={() => setSr(!sr)}>Senior citizen (+0.50%)</button>
  </>} right={<>
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Maturity value · {d.rate.toFixed(2)}% quarterly compounding</p><p className="font-display text-5xl text-gold-gradient">{inr(d.mat)}</p>
    <div className="mt-5 grid grid-cols-2 gap-3"><Stat k="Principal" v={inr(p, true)} /><Stat k="Interest earned" v={inr(d.mat - p, true)} /></div>
    <div className="mt-6"><StackedBars data={d.rows} /><Legend items={[['#3ddc97', 'Principal'], ['#e4b95e', 'Interest']]} /></div>
  </>} />
}

function Goal() {
  const [t, setT] = useState(5000000); const [y, setY] = useState(12); const [r, setR] = useState(11); const [inf, setInf] = useState(6); const [cur, setCur] = useState(200000)
  const d = useMemo(() => {
    const i = r / 12 / 100, n = y * 12
    const future = t * Math.pow(1 + inf / 100, y)
    const fvCur = cur * Math.pow(1 + i, n)
    const need = Math.max(future - fvCur, 0)
    const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    const sip = need / factor
    return { future, sip, need, fvCur }
  }, [t, y, r, inf, cur])
  return <Panel left={<>
    <Slider label="Goal amount (today’s value)" value={t} onChange={setT} min={100000} max={50000000} step={100000} fmt={n => inr(n, true)} />
    <Slider label="Years to goal" value={y} onChange={setY} min={1} max={35} step={1} fmt={n => n + ' yrs'} />
    <Slider label="Expected return (p.a.)" value={r} onChange={setR} min={4} max={16} step={0.5} fmt={n => n + '%'} />
    <Slider label="Inflation (p.a.)" value={inf} onChange={setInf} min={2} max={10} step={0.5} fmt={n => n + '%'} />
    <Slider label="Already invested" value={cur} onChange={setCur} min={0} max={5000000} step={10000} fmt={n => inr(n, true)} />
  </>} right={<>
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Monthly SIP required</p><p className="font-display text-5xl text-gold-gradient">{inr(d.sip)}</p>
    <div className="mt-5 grid grid-cols-2 gap-3"><Stat k="Goal after inflation" v={inr(d.future, true)} /><Stat k="Existing corpus grows to" v={inr(d.fvCur, true)} /></div>
    <p className="mt-6 rounded-2xl border border-gold/15 bg-gold/5 p-4 text-xs leading-6 text-slate-300">To reach <b className="text-gold-2">{inr(t, true)}</b> in today’s money, you need about <b className="text-gold-2">{inr(d.future, true)}</b> in {y} years. Investing {inr(d.sip)} each month at {r}% p.a. closes the gap of {inr(d.need, true)}.</p>
  </>} />
}

function Panel({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-7">{left}</div><div className="rounded-2xl border border-white/10 bg-black/20 p-6">{right}</div></div>
}

export default function Calculators() {
  const [tab, setTab] = useState<Tab>('sip')
  return <section id="calculators" className="border-y border-white/10 bg-ink-2 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">Calculators</p><h2 className="section-title">Plan before you commit.</h2><p className="section-copy">Interactive estimates for investing, borrowing and saving. Move the sliders — results update instantly.</p></div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Calculator">{tabs.map(([k, l]) => <button key={k} className="chip !px-5 !py-2.5 !text-[13px]" aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div></div>
      <div className="card mt-10 p-6 sm:p-8">{tab === 'sip' ? <SIP /> : tab === 'emi' ? <EMI /> : tab === 'fd' ? <FD /> : <Goal />}</div>
      <p className="mt-4 text-[11px] leading-5 text-slate-600">Calculators provide illustrative estimates using the inputs you enter. Actual returns, rates and EMIs may differ. This is not investment advice.</p>
    </div>
  </section>
}
