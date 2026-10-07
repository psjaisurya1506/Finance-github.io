'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Calculators from '@/components/Calculators'
import Markets from '@/components/Markets'
import Dashboard from '@/components/Dashboard'
import FinanceManager from '@/components/FinanceManager'
import InsightsTrust from '@/components/InsightsTrust'
import Tracker from '@/components/Tracker'
import FaqContact from '@/components/FaqContact'
import Footer from '@/components/Footer'
import ApplicationForm from '@/components/ApplicationForm'
import SignIn from '@/components/SignIn'
import { productById } from '@/lib/data'
import { useLocalState, type Application, type User } from '@/lib/store'

export default function Home() {
  const [user, setUser] = useLocalState<User | null>('fermor:user', null)
  const [apps, setApps] = useLocalState<Application[]>('fermor:apps', [])
  const [watch, setWatch] = useLocalState<string[]>('fermor:watch', ['NIFTY50', 'HDFCBANK', 'FRMGROWTH'])
  const [applyId, setApplyId] = useState<string | null>(null)
  const [signIn, setSignIn] = useState(false)

  const toggleWatch = useCallback((s: string) => setWatch(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]), [setWatch])
  const product = applyId ? productById(applyId) ?? null : null
  const modalOpen = !!product || signIn

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setApplyId(null); setSignIn(false) } }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [modalOpen])

  const open = (id = 'savings') => setApplyId(id)

  return (
    <main className="min-h-screen overflow-x-hidden bg-ink text-paper">
      <Navbar user={user} onSignIn={() => setSignIn(true)} onSignOut={() => setUser(null)} onOpen={() => open()} />
      <Hero onOpen={() => open()} />
      <FinanceManager />
      <Products onApply={open} />
      <Calculators />
      <Markets watch={watch} toggleWatch={toggleWatch} />
      <Dashboard user={user} onSignIn={() => setSignIn(true)} onOpen={() => open('sip')} />
      <InsightsTrust />
      <Tracker apps={apps} advance={ref => setApps(p => p.map(a => a.ref === ref ? { ...a, stage: Math.min(4, a.stage + 1) } : a))} remove={ref => setApps(p => p.filter(a => a.ref !== ref))} />
      <FaqContact />
      <Footer />

      <AnimatePresence>
        {product && <motion.div key="apply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-5">
          <div role="dialog" aria-modal="true" aria-label={`Apply: ${product.name}`} className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-2 shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-ink-2/95 px-6 py-4 backdrop-blur-xl">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Secure application</p><p className="font-display mt-1 text-lg text-paper">{product.name}</p></div>
              <button onClick={() => setApplyId(null)} aria-label="Close application" className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-paper"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 sm:p-8"><ApplicationForm key={product.id} productId={product.id} user={user} onClose={() => setApplyId(null)} onSubmitted={a => setApps(p => [a, ...p])} /></div>
          </div>
        </motion.div>}
      </AnimatePresence>
      {signIn && <SignIn onClose={() => setSignIn(false)} onSignIn={u => { setUser(u); setSignIn(false) }} />}
    </main>
  )
}
