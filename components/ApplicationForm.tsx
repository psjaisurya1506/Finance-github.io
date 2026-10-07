'use client'

import { DragEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Copy, FileUp, Loader2, Lock, UploadCloud } from 'lucide-react'
import { inr, productById, products, type Product } from '@/lib/data'
import type { Application, User } from '@/lib/store'

const steps = ['Product', 'Personal', 'KYC', 'Financials', 'Documents', 'Review']
const MAX = 5 * 1024 * 1024
const emailRe = /^\S+@\S+\.\S+$/
const mobileRe = /^(\+91[\s-]?)?[6-9]\d{9}$/
const panRe = /^[A-Z]{5}[0-9]{4}[A-Z]$/
type Form = { productId: string; amount: string; tenure: string; name: string; email: string; phone: string; dob: string; pan: string; address: string; city: string; pincode: string; employment: string; income: string; emis: string; consent: boolean; bureau: boolean }
const blank = (productId: string, u: User | null): Form => ({ productId, amount: '', tenure: '5', name: u?.name ?? '', email: u?.email ?? '', phone: '', dob: '', pan: '', address: '', city: '', pincode: '', employment: '', income: '', emis: '0', consent: false, bureau: false })

const amountLabel = (k: Product['kind']) => k === 'loan' ? 'Loan amount required (₹)' : k === 'invest' ? 'Amount to invest (₹)' : k === 'insure' ? 'Cover required (₹)' : 'Opening deposit (₹, optional)'
const idOf = (k: Product['kind']) => ({ loan: 'L', invest: 'I', insure: 'P', bank: 'B' }[k])

/** Present value of an EMI stream — used for an indicative loan-eligibility estimate. */
function eligibleLoan(income: number, emis: number, months: number, rate = 10.5) {
  const cap = Math.max(income * 0.5 - emis, 0), i = rate / 1200
  return cap * (1 - Math.pow(1 + i, -months)) / i
}

type Props = { productId: string; user: User | null; onClose: () => void; onSubmitted: (a: Application) => void }

export default function ApplicationForm({ productId, user, onClose, onSubmitted }: Props) {
  const draftKey = 'fermor:draft'
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(() => blank(productId, user))
  const [idDoc, setIdDoc] = useState<File | null>(null)
  const [incDoc, setIncDoc] = useState<File | null>(null)
  const [fileErr, setFileErr] = useState('')
  const [touched, setTouched] = useState(false)
  const [ageErr, setAgeErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<Application | null>(null)
  const [copied, setCopied] = useState(false)
  const [restored, setRestored] = useState(false)

  const product = productById(form.productId) ?? products[0]
  const isLoan = product.kind === 'loan'

  useEffect(() => {
    // Restore non-sensitive draft fields (PAN and DOB are never persisted)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const raw = localStorage.getItem(draftKey); if (raw) { const d = JSON.parse(raw); setForm(p => ({ ...p, ...d, productId, pan: '', dob: '', consent: false, bureau: false })); setRestored(true) } } catch {}
  }, [productId])
  useEffect(() => {
    if (done) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pan, dob, consent, bureau, ...safe } = form
    try { localStorage.setItem(draftKey, JSON.stringify(safe)) } catch {}
  }, [form, done])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }))
  const amount = parseFloat(form.amount) || 0
  const income = parseFloat(form.income) || 0
  const emis = parseFloat(form.emis) || 0
  const elig = isLoan && income > 0 ? eligibleLoan(income, emis, (parseInt(form.tenure) || 5) * 12) : 0

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (step === 0 && product.kind !== 'bank') { if (amount < product.min) e.amount = `Minimum is ${inr(product.min)}` }
    if (step === 1) {
      if (form.name.trim().length < 2) e.name = 'Enter your full name'
      if (!emailRe.test(form.email)) e.email = 'Enter a valid email'
      if (!mobileRe.test(form.phone.replace(/[\s-]/g, '').replace(/^(\+91)/, '+91'))) e.phone = 'Enter a valid 10-digit mobile number'
      if (!form.dob) e.dob = 'Select your date of birth'
    }
    if (step === 2) {
      if (!panRe.test(form.pan)) e.pan = 'PAN format: ABCDE1234F'
      if (form.address.trim().length < 8) e.address = 'Enter your full address'
      if (!form.city.trim()) e.city = 'Required'
      if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit PIN code'
    }
    if (step === 3) { if (!form.employment) e.employment = 'Select one'; if (!(income > 0)) e.income = 'Enter your monthly income'; if (emis < 0) e.emis = 'Cannot be negative' }
    if (step === 4) { if (!idDoc) e.idDoc = 'Upload an ID / address proof'; if (isLoan && !incDoc) e.incDoc = 'Income proof is required for loans' }
    if (step === 5) { if (!form.consent) e.consent = 'Please confirm to submit'; if (isLoan && !form.bureau) e.bureau = 'Credit-bureau consent is required for loans' }
    return e
  }, [step, form, product, amount, income, emis, idDoc, incDoc, isLoan])
  const hasErr = Object.keys(errors).length > 0
  const err = (k: string) => touched && errors[k] ? <p role="alert" className="mt-1.5 text-[11px] text-rose">{errors[k]}</p> : null
  const inv = (k: string) => touched && !!errors[k]

  const next = () => {
    setTouched(true)
    if (hasErr) return
    if (step === 1) { // age check uses the current date, so it runs in the handler, not during render
      const b = new Date(form.dob), n = new Date()
      let age = n.getFullYear() - b.getFullYear(); const m = n.getMonth() - b.getMonth()
      if (m < 0 || (m === 0 && n.getDate() < b.getDate())) age--
      if (Number.isNaN(age) || age < 18) { setAgeErr('You must be at least 18 years old to apply.'); return }
      if (age > 100) { setAgeErr('Please check your date of birth.'); return }
      setAgeErr('')
    }
    setTouched(false); setStep(s => Math.min(5, s + 1))
  }
  const back = () => { setTouched(false); if (step === 0) onClose(); else setStep(s => s - 1) }

  const pick = (file: File | null | undefined, setter: (f: File) => void) => {
    if (!file) return
    if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) return setFileErr('Only PDF, PNG or JPG files are accepted')
    if (file.size > MAX) return setFileErr('File is larger than 5 MB')
    setFileErr(''); setter(file)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault(); setTouched(true); if (hasErr) return
    setLoading(true)
    setTimeout(() => {
      const ref = `FRM-${idOf(product.kind)}-${Math.floor(10000 + Math.random() * 90000)}`
      const app: Application = { ref, productId: product.id, productName: product.name, amount, name: form.name.trim(), email: form.email.trim(), submittedAt: new Date().toISOString(), stage: 0 }
      try { localStorage.removeItem(draftKey) } catch {}
      setLoading(false); setDone(app); onSubmitted(app)
    }, 1300)
  }

  if (done) return <div className="py-10 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint/10 text-mint"><CheckCircle2 className="h-8 w-8" /></div>
    <h3 className="font-display mt-6 text-3xl text-paper">Application received.</h3>
    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">Thank you, {done.name.split(' ')[0]}. Your application for <span className="text-paper">{product.name}</span> is in. Keep your reference ID to track progress.</p>
    <div className="mx-auto mt-6 flex max-w-xs items-center justify-between gap-3 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3"><span className="font-mono text-sm font-bold tracking-wider text-gold-2">{done.ref}</span><button type="button" onClick={() => { navigator.clipboard?.writeText(done.ref); setCopied(true); setTimeout(() => setCopied(false), 1500) }} className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-paper"><Copy className="h-3.5 w-3.5" />{copied ? 'Copied' : 'Copy'}</button></div>
    <div className="mt-8 flex justify-center gap-3"><a href="#track" onClick={onClose} className="btn-gold">Track application</a><button onClick={onClose} className="btn-ghost">Close</button></div>
    <p className="mx-auto mt-6 max-w-sm text-[11px] leading-4 text-slate-600">Demo build: your application is stored only in this browser. PAN and date of birth are not saved.</p>
  </div>

  return <form onSubmit={submit} noValidate>
    <ol className="mb-7 flex items-center gap-2" aria-label="Progress">{steps.map((label, i) => <li key={label} className="flex flex-1 items-center gap-2" aria-current={i === step ? 'step' : undefined}>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${i <= step ? 'bg-gold text-ink' : 'bg-white/5 text-slate-500'}`}>{i < step ? '✓' : i + 1}</span>
      <span className={`hidden text-[11px] font-semibold lg:block ${i === step ? 'text-paper' : 'text-slate-600'}`}>{label}</span>
      {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? 'bg-gold/50' : 'bg-white/10'}`} />}
    </li>)}</ol>
    {restored && step === 0 && <p className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-4 py-2.5 text-xs text-slate-400">Draft restored. <button type="button" onClick={() => { setForm(blank(productId, user)); setRestored(false) }} className="font-semibold text-gold hover:underline">Start fresh</button></p>}

    {step === 0 && <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><F label="Product" req><select className="input-field" value={form.productId} onChange={e => set('productId', e.target.value)}>{(['Invest', 'Borrow', 'Protect', 'Bank'] as const).map(c => <optgroup key={c} label={c}>{products.filter(p => p.category === c).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>)}</select></F></div>
      <F label={amountLabel(product.kind)} req={product.kind !== 'bank'} err={err('amount')}><input inputMode="numeric" aria-invalid={inv('amount')} className="input-field" value={form.amount} onChange={e => set('amount', e.target.value.replace(/[^\d]/g, ''))} placeholder={product.min ? String(product.min) : '10000'} /></F>
      {(isLoan || product.id === 'fd') && <F label="Tenure"><select className="input-field" value={form.tenure} onChange={e => set('tenure', e.target.value)}>{[1, 2, 3, 5, 7, 10, 15, 20, 25, 30].filter(y => product.id === 'fd' ? y <= 5 : true).map(y => <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>)}</select></F>}
      <p className="rounded-xl border border-white/10 bg-white/[.02] p-4 text-xs leading-5 text-slate-500 sm:col-span-2">{product.tagline} <span className="text-gold-2">{product.headline} {product.headlineLabel}</span></p>
    </div>}

    {step === 1 && <div className="grid gap-4 sm:grid-cols-2">
      <F label="Full name (as on PAN)" req err={err('name')}><input aria-invalid={inv('name')} className="input-field" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" /></F>
      <F label="Email" req err={err('email')}><input type="email" aria-invalid={inv('email')} className="input-field" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></F>
      <F label="Mobile number" req err={err('phone')}><input inputMode="tel" aria-invalid={inv('phone')} className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="98765 43210" autoComplete="tel" /></F>
      <F label="Date of birth" req err={err('dob') ?? (ageErr ? <p role="alert" className="mt-1.5 text-[11px] text-rose">{ageErr}</p> : null)}><input type="date" aria-invalid={inv('dob') || !!ageErr} className="input-field" value={form.dob} onChange={e => { set('dob', e.target.value); setAgeErr('') }} /></F>
    </div>}

    {step === 2 && <div className="grid gap-4 sm:grid-cols-2">
      <F label="PAN" req err={err('pan')}><input aria-invalid={inv('pan')} maxLength={10} className="input-field font-mono uppercase tracking-widest" value={form.pan} onChange={e => set('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" autoComplete="off" /></F>
      <F label="PIN code" req err={err('pincode')}><input inputMode="numeric" maxLength={6} aria-invalid={inv('pincode')} className="input-field" value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} placeholder="600001" /></F>
      <div className="sm:col-span-2"><F label="Residential address" req err={err('address')}><input aria-invalid={inv('address')} className="input-field" value={form.address} onChange={e => set('address', e.target.value)} autoComplete="street-address" /></F></div>
      <F label="City" req err={err('city')}><input aria-invalid={inv('city')} className="input-field" value={form.city} onChange={e => set('city', e.target.value)} /></F>
      <p className="flex items-start gap-2 self-end text-[11px] leading-4 text-slate-500"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />Your PAN is used only for KYC in a real deployment. This demo never stores it.</p>
    </div>}

    {step === 3 && <div className="grid gap-4 sm:grid-cols-2">
      <F label="Employment type" req err={err('employment')}><select aria-invalid={inv('employment')} className="input-field" value={form.employment} onChange={e => set('employment', e.target.value)}><option value="">Select…</option>{['Salaried', 'Self-employed professional', 'Business owner', 'Student', 'Retired'].map(x => <option key={x}>{x}</option>)}</select></F>
      <F label="Monthly income (₹)" req err={err('income')}><input inputMode="numeric" aria-invalid={inv('income')} className="input-field" value={form.income} onChange={e => set('income', e.target.value.replace(/\D/g, ''))} placeholder="85000" /></F>
      <F label="Existing monthly EMIs (₹)" err={err('emis')}><input inputMode="numeric" className="input-field" value={form.emis} onChange={e => set('emis', e.target.value.replace(/\D/g, ''))} /></F>
      <div className="sm:col-span-2">{isLoan && elig > 0 && (amount <= elig
        ? <p className="flex gap-3 rounded-xl border border-mint/25 bg-mint/10 p-4 text-xs leading-5 text-mint"><CheckCircle2 className="h-4 w-4 shrink-0" />Indicative eligibility ≈ {inr(elig, true)}. Your request of {inr(amount, true)} looks comfortably within range. Final approval depends on credit assessment.</p>
        : <p className="flex gap-3 rounded-xl border border-gold/30 bg-gold/10 p-4 text-xs leading-5 text-gold-2"><AlertTriangle className="h-4 w-4 shrink-0" />Indicative eligibility ≈ {inr(elig, true)}, below your request of {inr(amount, true)}. You can still apply, or consider a longer tenure, a co-applicant or a smaller amount.</p>)}
        {!isLoan && <p className="rounded-xl border border-white/10 bg-white/[.02] p-4 text-xs leading-5 text-slate-500">We use income details to assess suitability and meet regulatory know-your-customer requirements.</p>}</div>
    </div>}

    {step === 4 && <div className="space-y-6">
      <DocSlot label="ID / address proof (Aadhaar, passport, driving licence)" req file={idDoc} onPick={f => pick(f, setIdDoc)} err={err('idDoc')} />
      <DocSlot label={isLoan ? 'Income proof (salary slips / bank statement / ITR)' : 'Income proof (optional)'} req={isLoan} file={incDoc} onPick={f => pick(f, setIncDoc)} err={err('incDoc')} />
      {fileErr && <p role="alert" className="text-[11px] text-rose">{fileErr}</p>}
    </div>}

    {step === 5 && <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">{[['Product', product.name], ['Amount', amount ? inr(amount) : '—'], ['Applicant', form.name], ['Email', form.email], ['Mobile', form.phone], ['PAN', form.pan.slice(0, 2) + '••••••' + form.pan.slice(-2)], ['Address', `${form.address}, ${form.city} ${form.pincode}`], ['Income', `${form.employment} · ${inr(income)}/mo`], ['Documents', [idDoc?.name, incDoc?.name].filter(Boolean).join(', ')]].map(([k, v]) => <div key={k} className="rounded-xl border border-white/10 bg-white/[.025] px-4 py-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">{k}</p><p className="mt-1 break-words text-xs font-medium text-slate-200">{v}</p></div>)}</div>
      <label className="mt-4 flex gap-3 rounded-xl border border-white/10 bg-white/[.02] p-4 text-xs leading-5 text-slate-400"><input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#e4b95e]" />I declare the information is true and complete, and I consent to Fermor verifying my KYC details and contacting me about this application.</label>{err('consent')}
      {isLoan && <><label className="flex gap-3 rounded-xl border border-white/10 bg-white/[.02] p-4 text-xs leading-5 text-slate-400"><input type="checkbox" checked={form.bureau} onChange={e => set('bureau', e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#e4b95e]" />I authorise Fermor to obtain my credit information report from credit bureaus for assessing this loan.</label>{err('bureau')}</>}
    </div>}

    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
      <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-paper">{step === 0 ? 'Cancel' : <><ArrowLeft className="h-4 w-4" /> Back</>}</button>
      {step < 5 ? <button type="button" onClick={next} className="btn-gold">Continue <ArrowRight className="h-4 w-4" /></button>
        : <button disabled={loading} className="btn-gold">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit application <CheckCircle2 className="h-4 w-4" /></>}</button>}
    </div>
  </form>
}

function DocSlot({ label, req, file, onPick, err }: { label: string; req?: boolean; file: File | null; onPick: (f: File | null | undefined) => void; err: React.ReactNode }) {
  const [drag, setDrag] = useState(false)
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); onPick(e.dataTransfer.files?.[0]) }
  return <div><span className="field-label">{label} {req && <span className="text-gold">*</span>}</span>
    <label onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop} className={`mt-1 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed px-5 py-5 transition ${drag ? 'border-gold bg-gold/10' : 'border-white/15 bg-white/[.02] hover:border-gold/40'}`}>
      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => onPick(e.target.files?.[0])} className="sr-only" />
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${file ? 'bg-mint/10 text-mint' : 'bg-gold/10 text-gold'}`}>{file ? <FileUp className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}</span>
      <span className="min-w-0"><span className="block truncate text-sm font-semibold text-paper">{file ? file.name : 'Drag & drop or click to upload'}</span><span className="text-xs text-slate-500">{file ? `${(file.size / 1024).toFixed(0)} KB · click to replace` : 'PDF, PNG or JPG · max 5 MB'}</span></span>
    </label>{err}</div>
}

function F({ label, req, err, children }: { label: string; req?: boolean; err?: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="field-label">{label} {req && <span className="text-gold">*</span>}</span>{children}{err}</label>
}
