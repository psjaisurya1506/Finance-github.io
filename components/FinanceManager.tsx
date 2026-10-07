'use client'

import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarClock, Check, ChevronRight, CircleDollarSign, Plus, ReceiptText, Target, Trash2, Wallet, X } from 'lucide-react'
import { inr } from '@/lib/data'
import { useLocalState } from '@/lib/store'

type Tx = { id:string; date:string; title:string; category:string; amount:number; kind:'income'|'expense'; account:string }
type Budget = { id:string; category:string; limit:number }
type Goal = { id:string; name:string; target:number; saved:number; due:string }
type Bill = { id:string; name:string; amount:number; due:string; autopay:boolean }

const seedTx:Tx[] = [
  {id:'1',date:'2026-10-06',title:'Salary credit',category:'Salary',amount:142000,kind:'income',account:'HDFC Bank'},
  {id:'2',date:'2026-10-06',title:'SIP investment',category:'Investments',amount:15000,kind:'expense',account:'HDFC Bank'},
  {id:'3',date:'2026-10-05',title:'Rent',category:'Housing',amount:28000,kind:'expense',account:'HDFC Bank'},
  {id:'4',date:'2026-10-04',title:'Grocery run',category:'Food',amount:4260,kind:'expense',account:'HDFC Bank'},
  {id:'5',date:'2026-10-02',title:'Electricity bill',category:'Utilities',amount:2180,kind:'expense',account:'HDFC Bank'},
  {id:'6',date:'2026-09-29',title:'Freelance payment',category:'Side income',amount:12000,kind:'income',account:'ICICI Bank'},
]
const seedBudgets:Budget[] = [
  {id:'1',category:'Food',limit:12000},{id:'2',category:'Transport',limit:7000},{id:'3',category:'Shopping',limit:10000},{id:'4',category:'Entertainment',limit:5000}
]
const seedGoals:Goal[] = [
  {id:'1',name:'Emergency fund',target:600000,saved:410000,due:'Dec 2026'},
  {id:'2',name:'Laptop upgrade',target:120000,saved:68000,due:'Mar 2027'},
  {id:'3',name:'Travel fund',target:150000,saved:52000,due:'Dec 2027'}
]
const seedBills:Bill[] = [
  {id:'1',name:'Home loan EMI',amount:38250,due:'2026-10-08',autopay:true},
  {id:'2',name:'Term insurance',amount:8400,due:'2026-10-15',autopay:true},
  {id:'3',name:'Internet',amount:999,due:'2026-10-18',autopay:false},
]

function Stat({label,value,sub,icon:Icon}:{label:string;value:string;sub:string;icon:any}){return <div className="card p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{label}</p><p className="font-display mt-2 text-2xl text-paper">{value}</p><p className="mt-1 text-xs text-slate-500">{sub}</p></div><span className="rounded-xl border border-gold/15 bg-gold/5 p-2.5 text-gold"><Icon className="h-4 w-4"/></span></div></div>}

export default function FinanceManager(){
  const [tx,setTx]=useLocalState<Tx[]>('fermor:finance:tx',seedTx)
  const [budgets,setBudgets]=useLocalState<Budget[]>('fermor:finance:budgets',seedBudgets)
  const [goals,setGoals]=useLocalState<Goal[]>('fermor:finance:goals',seedGoals)
  const [bills,setBills]=useLocalState<Bill[]>('fermor:finance:bills',seedBills)
  const [tab,setTab]=useState<'overview'|'transactions'|'budgets'|'goals'|'bills'>('overview')
  const [showAdd,setShowAdd]=useState(false)
  const [showGoal,setShowGoal]=useState(false)
  const [form,setForm]=useState({title:'',amount:'',category:'Food',kind:'expense' as 'income'|'expense',account:'HDFC Bank'})
  const [goalForm,setGoalForm]=useState({name:'',target:'',saved:'',due:''})

  const income=useMemo(()=>tx.filter(x=>x.kind==='income').reduce((a,x)=>a+x.amount,0),[tx])
  const expenses=useMemo(()=>tx.filter(x=>x.kind==='expense').reduce((a,x)=>a+x.amount,0),[tx])
  const savings=Math.max(income-expenses,0)
  const savingsRate=income?Math.round(savings/income*100):0
  const monthSpend=expenses
  const categorySpend=useMemo(()=>budgets.map(b=>({...b,spent:tx.filter(x=>x.kind==='expense'&&x.category===b.category).reduce((a,x)=>a+x.amount,0)})),[budgets,tx])
  const upcoming=bills.slice().sort((a,b)=>a.due.localeCompare(b.due)).slice(0,3)

  function addTx(){
    const amount=Number(form.amount)
    if(!form.title.trim()||!amount||amount<0)return
    setTx(p=>[{id:crypto.randomUUID(),date:new Date().toISOString().slice(0,10),title:form.title.trim(),category:form.category,amount,kind:form.kind,account:form.account},...p])
    setForm({title:'',amount:'',category:'Food',kind:'expense',account:'HDFC Bank'});setShowAdd(false)
  }
  function addGoal(){
    const target=Number(goalForm.target),saved=Number(goalForm.saved)||0
    if(!goalForm.name.trim()||!target)return
    setGoals(p=>[...p,{id:crypto.randomUUID(),name:goalForm.name.trim(),target,saved,due:goalForm.due||'Not set'}])
    setGoalForm({name:'',target:'',saved:'',due:''});setShowGoal(false)
  }

  return <section id="finance-manager" className="border-y border-white/10 bg-ink-2 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="eyebrow">Personal finance command centre</p><h2 className="section-title">Understand every rupee. Plan what comes next.</h2><p className="section-copy">A practical money cockpit for cash flow, spending, budgets, goals and recurring commitments. Demo data is stored locally in your browser.</p></div>
        <div className="flex gap-3"><button onClick={()=>setShowAdd(true)} className="btn-gold"><Plus className="h-4 w-4"/>Add transaction</button><button onClick={()=>setShowGoal(true)} className="btn-ghost"><Target className="h-4 w-4"/>New goal</button></div>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Cash flow this period" value={inr(savings,true)} sub={`${savingsRate}% savings rate`} icon={CircleDollarSign}/>
        <Stat label="Income tracked" value={inr(income,true)} sub="Across your recorded accounts" icon={ArrowDownLeft}/>
        <Stat label="Spending tracked" value={inr(monthSpend,true)} sub="Categorised expenses" icon={ArrowUpRight}/>
        <Stat label="Upcoming bills" value={inr(bills.reduce((a,b)=>a+b.amount,0),true)} sub={`${bills.length} recurring commitments`} icon={CalendarClock}/>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">{(['overview','transactions','budgets','goals','bills'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`chip whitespace-nowrap ${tab===t?'!border-gold/30 !bg-gold/10 !text-gold-2':''}`}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div>

      {tab==='overview' && <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Cash-flow pulse</p><p className="mt-1 text-sm text-slate-400">Income vs expenses from your recorded transactions</p></div><Wallet className="h-5 w-5 text-slate-500"/></div><div className="mt-7 grid grid-cols-6 items-end gap-3 sm:grid-cols-12">{Array.from({length:12},(_,i)=>{const inc=[32,40,35,52,46,68,55,72,61,82,75,100][i];const exp=[22,28,31,34,39,44,48,42,55,49,60,57][i];return <div key={i} className="flex h-40 items-end gap-1"><div className="w-1/2 rounded-t bg-mint/70" style={{height:`${inc}%`}}/><div className="w-1/2 rounded-t bg-gold/70" style={{height:`${exp}%`}}/></div>})}</div><div className="mt-4 flex gap-5 text-[11px] text-slate-500"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-mint"/>Income</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-gold"/>Expenses</span></div></div>
        <div className="card p-6"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Smart money signals</p><div className="mt-5 space-y-4"><div className="rounded-2xl border border-mint/15 bg-mint/5 p-4"><p className="text-sm font-semibold text-paper">Savings rate is {savingsRate}%</p><p className="mt-1 text-xs leading-5 text-slate-400">Your recorded income leaves {inr(savings,true)} after tracked expenses.</p></div><div className="rounded-2xl border border-gold/15 bg-gold/5 p-4"><p className="text-sm font-semibold text-paper">Budget watch</p><p className="mt-1 text-xs leading-5 text-slate-400">{categorySpend.filter(x=>x.spent>x.limit*.8).length} categories are above 80% of their budget.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-sm font-semibold text-paper">Next commitment</p><p className="mt-1 text-xs leading-5 text-slate-400">{upcoming[0]?.name} · {upcoming[0]?inr(upcoming[0].amount):'—'}</p></div></div></div>
        <div className="card p-6 lg:col-span-2"><div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Budget health</p><button onClick={()=>setTab('budgets')} className="text-xs text-gold">View budgets <ChevronRight className="inline h-3 w-3"/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{categorySpend.map(b=>{const pct=Math.min(100,Math.round(b.spent/b.limit*100));return <div key={b.id}><div className="flex justify-between text-sm"><span className="text-paper">{b.category}</span><span className={pct>=100?'text-rose':'text-slate-400'}>{inr(b.spent,true)} / {inr(b.limit,true)}</span></div><div className="mt-2 h-2 rounded-full bg-white/5"><div className={`h-full rounded-full ${pct>=100?'bg-rose':'bg-gradient-to-r from-gold to-mint'}`} style={{width:`${pct}%`}}/></div></div>})}</div></div>
        <div className="card p-6"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Goal momentum</p><div className="mt-5 space-y-5">{goals.slice(0,3).map(g=>{const pct=Math.min(100,Math.round(g.saved/g.target*100));return <div key={g.id}><div className="flex justify-between text-xs"><span className="text-paper">{g.name}</span><span className="text-gold-2">{pct}%</span></div><div className="mt-2 h-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-mint" style={{width:`${pct}%`}}/></div></div>})}</div></div>
      </div>}

      {tab==='transactions' && <div className="card mt-5 overflow-x-auto p-6"><div className="mb-4 flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">Transaction ledger</p><button onClick={()=>setShowAdd(true)} className="btn-ghost !px-3 !py-2 !text-xs"><Plus className="h-3.5 w-3.5"/>Add</button></div><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><th className="p-3">Date</th><th className="p-3">Description</th><th className="p-3">Category</th><th className="p-3">Account</th><th className="p-3 text-right">Amount</th><th/></tr></thead><tbody>{tx.map(x=><tr key={x.id} className="border-b border-white/5"><td className="p-3 text-slate-500">{x.date}</td><td className="p-3 text-paper">{x.title}</td><td className="p-3 text-slate-400">{x.category}</td><td className="p-3 text-slate-400">{x.account}</td><td className={`p-3 text-right font-semibold ${x.kind==='income'?'text-mint':'text-paper'}`}>{x.kind==='income'?'+':'−'}{inr(x.amount)}</td><td className="p-3 text-right"><button onClick={()=>setTx(p=>p.filter(y=>y.id!==x.id))} className="text-slate-600 hover:text-rose"><Trash2 className="h-4 w-4"/></button></td></tr>)}</tbody></table></div>}

      {tab==='budgets' && <div className="mt-5 grid gap-5 md:grid-cols-2">{categorySpend.map(b=>{const pct=Math.round(b.spent/b.limit*100);return <div key={b.id} className="card p-6"><div className="flex justify-between"><div><p className="font-display text-lg text-paper">{b.category}</p><p className="text-xs text-slate-500">Monthly spending limit</p></div><p className={pct>=100?'text-rose':'text-gold-2'}>{pct}%</p></div><div className="mt-5 h-3 rounded-full bg-white/5"><div className={`h-full rounded-full ${pct>=100?'bg-rose':'bg-gradient-to-r from-gold to-mint'}`} style={{width:`${Math.min(100,pct)}%`}}/></div><div className="mt-3 flex justify-between text-xs"><span className="text-slate-400">Spent {inr(b.spent,true)}</span><span className="text-slate-500">Limit {inr(b.limit,true)}</span></div></div>})}</div>}

      {tab==='goals' && <div className="mt-5 grid gap-5 md:grid-cols-2">{goals.map(g=>{const pct=Math.min(100,Math.round(g.saved/g.target*100));return <div key={g.id} className="card p-6"><div className="flex justify-between"><div><p className="font-display text-xl text-paper">{g.name}</p><p className="mt-1 text-xs text-slate-500">Target {g.due}</p></div><button onClick={()=>setGoals(p=>p.filter(x=>x.id!==g.id))} className="text-slate-600 hover:text-rose"><Trash2 className="h-4 w-4"/></button></div><p className="mt-6 font-display text-3xl text-gold-gradient">{inr(g.saved,true)}</p><div className="mt-3 h-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-gold to-mint" style={{width:`${pct}%`}}/></div><p className="mt-2 text-xs text-slate-500">{pct}% complete · {inr(Math.max(0,g.target-g.saved),true)} remaining</p></div>})}<button onClick={()=>setShowGoal(true)} className="card flex min-h-[190px] items-center justify-center border-dashed text-sm text-slate-400 hover:border-gold/30 hover:text-gold"><Plus className="mr-2 h-4 w-4"/>Create a financial goal</button></div>}

      {tab==='bills' && <div className="mt-5 grid gap-5 md:grid-cols-3">{bills.map(b=><div key={b.id} className="card p-6"><div className="flex items-start justify-between"><span className="rounded-xl bg-gold/10 p-2.5 text-gold"><ReceiptText className="h-5 w-5"/></span><button onClick={()=>setBills(p=>p.filter(x=>x.id!==b.id))} className="text-slate-600 hover:text-rose"><Trash2 className="h-4 w-4"/></button></div><p className="mt-5 font-display text-lg text-paper">{b.name}</p><p className="mt-1 text-xs text-slate-500">Due {b.due}</p><p className="mt-4 font-display text-2xl text-paper">{inr(b.amount)}</p><span className={`mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${b.autopay?'bg-mint/10 text-mint':'bg-white/5 text-slate-400'}`}>{b.autopay?<><Check className="h-3 w-3"/>Auto-pay on</>:<>Manual payment</>}</span></div>)}</div>}
    </div>

    {showAdd && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-2 p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">New transaction</p><h3 className="font-display mt-1 text-xl text-paper">Record money movement</h3></div><button onClick={()=>setShowAdd(false)} className="text-slate-500"><X/></button></div><div className="mt-6 grid gap-4"><div className="grid grid-cols-2 gap-2"><button onClick={()=>setForm({...form,kind:'expense'})} className={`chip ${form.kind==='expense'?'!bg-gold/10 !text-gold':''}`}>Expense</button><button onClick={()=>setForm({...form,kind:'income'})} className={`chip ${form.kind==='income'?'!bg-mint/10 !text-mint':''}`}>Income</button></div><input className="input-field" placeholder="Description" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><div className="grid grid-cols-2 gap-3"><input className="input-field" type="number" placeholder="Amount ₹" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/><select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Food</option><option>Housing</option><option>Transport</option><option>Shopping</option><option>Utilities</option><option>Investments</option><option>Salary</option><option>Side income</option><option>Entertainment</option></select></div><select className="input-field" value={form.account} onChange={e=>setForm({...form,account:e.target.value})}><option>HDFC Bank</option><option>ICICI Bank</option><option>Cash</option><option>Credit Card</option></select><button onClick={addTx} className="btn-gold justify-center">Save transaction</button></div></div></div>}
    {showGoal && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-2 p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Financial goal</p><h3 className="font-display mt-1 text-xl text-paper">Give your money a destination</h3></div><button onClick={()=>setShowGoal(false)} className="text-slate-500"><X/></button></div><div className="mt-6 grid gap-4"><input className="input-field" placeholder="Goal name" value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})}/><div className="grid grid-cols-2 gap-3"><input className="input-field" type="number" placeholder="Target ₹" value={goalForm.target} onChange={e=>setGoalForm({...goalForm,target:e.target.value})}/><input className="input-field" type="number" placeholder="Already saved ₹" value={goalForm.saved} onChange={e=>setGoalForm({...goalForm,saved:e.target.value})}/></div><input className="input-field" placeholder="Target date, e.g. Jun 2028" value={goalForm.due} onChange={e=>setGoalForm({...goalForm,due:e.target.value})}/><button onClick={addGoal} className="btn-gold justify-center">Create goal</button></div></div></div>}
  </section>
}
