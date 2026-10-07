'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Landmark, LogOut, Menu, UserRound, X } from 'lucide-react'
import type { User } from '@/lib/store'

const links = [['#finance-manager', 'My Money'], ['#products', 'Products'], ['#calculators', 'Calculators'], ['#markets', 'Markets'], ['#dashboard', 'Dashboard'], ['#insights', 'Insights'], ['#track', 'Track']]

export default function Navbar({ user, onSignIn, onSignOut, onOpen }: { user: User | null; onSignIn: () => void; onSignOut: () => void; onOpen: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0)
    }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const first = user?.name.split(' ')[0]

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'border-b border-white/10 bg-ink/85 backdrop-blur-2xl' : 'bg-transparent'}`}>
    <div className="absolute inset-x-0 top-0 h-[2px]"><div className="h-full bg-gradient-to-r from-gold to-mint" style={{ width: `${progress}%` }} /></div>
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
      <a href="#top" className="flex items-center gap-3" aria-label="Fermor Financial home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-2 to-gold text-ink"><Landmark className="h-5 w-5" /></span>
        <span><span className="font-display block text-lg font-semibold leading-none text-paper">Fermor</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.22em] text-gold/80">Financial</span></span>
      </a>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">{links.map(([h, l]) => <a key={h} href={h} className="text-[13px] font-medium text-slate-300/80 transition hover:text-gold">{l}</a>)}</nav>
      <div className="hidden items-center gap-3 lg:flex">
        {user ? <>
          <span className="flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-[13px] font-semibold text-paper"><UserRound className="h-4 w-4 text-gold" />{first}</span>
          <button onClick={onSignOut} aria-label="Sign out" className="rounded-xl p-2.5 text-slate-400 hover:text-paper"><LogOut className="h-4 w-4" /></button>
        </> : <button onClick={onSignIn} className="btn-ghost !py-2.5 !text-[13px]">Client login</button>}
        <button onClick={onOpen} className="btn-gold !py-2.5 !text-[13px]">Open account <ArrowRight className="h-4 w-4" /></button>
      </div>
      <button onClick={() => setOpen(!open)} className="rounded-xl p-2 text-slate-200 lg:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-white/10 bg-ink/98 px-6 py-5 backdrop-blur-xl lg:hidden">
      {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3 text-sm text-slate-200">{l}</a>)}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {user ? <button onClick={() => { setOpen(false); onSignOut() }} className="btn-ghost">Sign out</button> : <button onClick={() => { setOpen(false); onSignIn() }} className="btn-ghost">Client login</button>}
        <button onClick={() => { setOpen(false); onOpen() }} className="btn-gold">Open account</button>
      </div>
    </div>}
  </header>
}
