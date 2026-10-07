import {
  BriefcaseBusiness, Building2, Car, CreditCard, GraduationCap, HeartPulse, Home, Landmark, LineChart, PiggyBank, TrendingUp, Umbrella, Wallet,
  type LucideIcon,
} from 'lucide-react'

export type Category = 'Invest' | 'Borrow' | 'Protect' | 'Bank'
export type Product = {
  id: string; name: string; category: Category; kind: 'invest' | 'loan' | 'insure' | 'bank'
  tagline: string; headline: string; headlineLabel: string; min: number; features: string[]; icon: LucideIcon; popular?: boolean
}

export const products: Product[] = [
  { id: 'sip', name: 'Systematic Investment Plan', category: 'Invest', kind: 'invest', tagline: 'Build wealth monthly with disciplined, goal-linked investing.', headline: '₹500', headlineLabel: 'start from / month', min: 500, features: ['Equity, hybrid and debt funds', 'Step-up and pause options', 'Goal tracking and rebalancing alerts'], icon: TrendingUp, popular: true },
  { id: 'pms', name: 'Portfolio Management Service', category: 'Invest', kind: 'invest', tagline: 'Discretionary portfolios managed by a dedicated team.', headline: '₹50L', headlineLabel: 'minimum corpus', min: 5000000, features: ['Concentrated multi-cap strategies', 'Quarterly review with your manager', 'Transparent fee and performance reports'], icon: LineChart },
  { id: 'fd', name: 'Fermor Fixed Deposit', category: 'Invest', kind: 'invest', tagline: 'Predictable returns with flexible tenures and quarterly payouts.', headline: '7.25%', headlineLabel: 'p.a. up to 5 yrs*', min: 10000, features: ['Tenure from 12 to 60 months', 'Senior-citizen bonus rate', 'Premature withdrawal available'], icon: PiggyBank },
  { id: 'home-loan', name: 'Home Loan', category: 'Borrow', kind: 'loan', tagline: 'Finance your home with transparent pricing and quick sanction.', headline: '8.50%', headlineLabel: 'onwards p.a.*', min: 500000, features: ['Up to 30-year tenure', 'No hidden prepayment charges on floating rate', 'Balance-transfer with top-up'], icon: Home, popular: true },
  { id: 'personal-loan', name: 'Personal Loan', category: 'Borrow', kind: 'loan', tagline: 'Collateral-free funds for planned and unplanned needs.', headline: '10.99%', headlineLabel: 'onwards p.a.*', min: 50000, features: ['Up to ₹40 lakh', 'Disbursal in as little as 48 hours', 'Flexible 12–72 month tenure'], icon: Wallet },
  { id: 'business-loan', name: 'Business Loan', category: 'Borrow', kind: 'loan', tagline: 'Working capital and growth funding for MSMEs.', headline: '₹2 Cr', headlineLabel: 'maximum limit', min: 200000, features: ['GST- and bank-statement-based underwriting', 'Overdraft and term options', 'Dedicated relationship manager'], icon: BriefcaseBusiness },
  { id: 'education-loan', name: 'Education Loan', category: 'Borrow', kind: 'loan', tagline: 'Fund studies in India or abroad with moratorium during the course.', headline: '9.25%', headlineLabel: 'onwards p.a.*', min: 100000, features: ['Covers tuition, living and travel', 'Repayment starts after course + 6 months', 'Tax benefit under Sec 80E'], icon: GraduationCap },
  { id: 'vehicle-loan', name: 'Vehicle Loan', category: 'Borrow', kind: 'loan', tagline: 'Drive home a new or pre-owned vehicle faster.', headline: '9.10%', headlineLabel: 'onwards p.a.*', min: 100000, features: ['Up to 90% on-road funding', 'Instant in-principle approval', 'EV-friendly rates'], icon: Car },
  { id: 'term', name: 'Term Life Insurance', category: 'Protect', kind: 'insure', tagline: 'Pure protection so your family’s goals stay on track.', headline: '₹1 Cr', headlineLabel: 'cover from ~₹700/mo*', min: 5000000, features: ['Cover up to age 85', 'Critical-illness and waiver riders', 'Claim assistance desk'], icon: Umbrella },
  { id: 'health', name: 'Health Insurance', category: 'Protect', kind: 'insure', tagline: 'Comprehensive cover with cashless treatment network.', headline: '10,000+', headlineLabel: 'network hospitals', min: 500000, features: ['Restoration and no-claim bonus', 'Day-care and pre/post hospitalisation', 'Family floater options'], icon: HeartPulse },
  { id: 'savings', name: 'Premium Savings Account', category: 'Bank', kind: 'bank', tagline: 'A modern account with sweep-in FD and zero-fee transfers.', headline: '3.50%', headlineLabel: 'interest p.a.*', min: 10000, features: ['Zero-fee UPI, NEFT, RTGS and IMPS', 'Auto-sweep to FD above threshold', 'Instant virtual debit card'], icon: Landmark },
  { id: 'card', name: 'Fermor Rewards Card', category: 'Bank', kind: 'bank', tagline: 'Everyday rewards with strong security controls.', headline: '5×', headlineLabel: 'points on bill pay', min: 0, features: ['Lifetime-free first year', 'Per-transaction limits and instant lock', 'Airport lounge access'], icon: CreditCard },
  { id: 'current', name: 'Business Current Account', category: 'Bank', kind: 'bank', tagline: 'Collections, payouts and GST reconciliation in one place.', headline: '24×7', headlineLabel: 'payments & payouts', min: 25000, features: ['Bulk payouts and auto-reconciliation', 'Multi-user approvals', 'Integrated invoicing'], icon: Building2 },
]

/* ---------- Markets (static sample data) ---------- */
function series(seed: number, n = 30, drift = 0.1) {
  let s = seed, v = 100; const out: number[] = []
  for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) % 4294967296; v += ((s / 4294967296) - 0.5 + drift / 10) * 4; out.push(+v.toFixed(2)) }
  return out
}
export type Quote = { sym: string; name: string; type: 'Index' | 'Equity' | 'Fund' | 'Commodity'; price: number; chg: number; spark: number[] }
export const quotes: Quote[] = [
  { sym: 'NIFTY50', name: 'Nifty 50', type: 'Index', price: 24812.45, chg: 0.42, spark: series(11, 30, 1) },
  { sym: 'SENSEX', name: 'BSE Sensex', type: 'Index', price: 81356.1, chg: 0.38, spark: series(12, 30, 1) },
  { sym: 'BANKNIFTY', name: 'Nifty Bank', type: 'Index', price: 53204.8, chg: -0.12, spark: series(13, 30, -1) },
  { sym: 'RELIANCE', name: 'Reliance Industries', type: 'Equity', price: 2942.3, chg: 0.86, spark: series(21, 30, 1) },
  { sym: 'HDFCBANK', name: 'HDFC Bank', type: 'Equity', price: 1688.55, chg: -0.41, spark: series(22, 30, -1) },
  { sym: 'TCS', name: 'Tata Consultancy Services', type: 'Equity', price: 4120.9, chg: 1.12, spark: series(23, 30, 2) },
  { sym: 'INFY', name: 'Infosys', type: 'Equity', price: 1873.2, chg: 0.67, spark: series(24, 30, 1) },
  { sym: 'ICICIBANK', name: 'ICICI Bank', type: 'Equity', price: 1241.75, chg: 0.19, spark: series(25, 30, 0.5) },
  { sym: 'ITC', name: 'ITC Ltd', type: 'Equity', price: 478.1, chg: -0.74, spark: series(26, 30, -1.5) },
  { sym: 'FRMGROWTH', name: 'Fermor Flexi-Cap Fund', type: 'Fund', price: 86.42, chg: 0.55, spark: series(31, 30, 1.5) },
  { sym: 'FRMBOND', name: 'Fermor Corporate Bond Fund', type: 'Fund', price: 24.18, chg: 0.04, spark: series(32, 30, 0.6) },
  { sym: 'GOLD', name: 'Gold (10 g)', type: 'Commodity', price: 72410, chg: 0.21, spark: series(41, 30, 1) },
]

/* ---------- Dashboard sample ---------- */
export const holdings = [
  { name: 'Fermor Flexi-Cap Fund', cls: 'Equity', value: 684000, day: 0.55, color: '#e4b95e' },
  { name: 'Direct equities', cls: 'Equity', value: 412500, day: 0.31, color: '#f3d58f' },
  { name: 'Fermor Corporate Bond Fund', cls: 'Debt', value: 356000, day: 0.04, color: '#3ddc97' },
  { name: 'Fixed deposits', cls: 'Debt', value: 300000, day: 0, color: '#2fa77a' },
  { name: 'Sovereign gold bonds', cls: 'Gold', value: 148000, day: 0.21, color: '#38bdf8' },
  { name: 'Liquid reserve', cls: 'Cash', value: 99500, day: 0.01, color: '#a78bfa' },
]
export const netWorthSeries = [15.4, 15.8, 15.6, 16.2, 16.9, 16.6, 17.5, 18.1, 17.8, 18.9, 19.5, 20.0]
export const monthsShort = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
export const goals = [
  { name: 'Home down payment', target: 2500000, saved: 1620000, by: 'Mar 2028' },
  { name: 'Child education', target: 5000000, saved: 1180000, by: 'Jun 2034' },
  { name: 'Emergency fund', target: 600000, saved: 540000, by: 'Dec 2026' },
]
export const transactions = [
  { d: '06 Oct', t: 'SIP · Fermor Flexi-Cap Fund', a: -15000 }, { d: '05 Oct', t: 'Salary credit', a: 142000 },
  { d: '03 Oct', t: 'FD interest credited', a: 5430 }, { d: '01 Oct', t: 'Home loan EMI', a: -38250 },
  { d: '29 Sep', t: 'Dividend · HDFC Bank', a: 3300 }, { d: '27 Sep', t: 'Insurance premium · Term plan', a: -8400 },
]

/* ---------- Application ---------- */
export const stages = [
  { key: 'submitted', label: 'Application received', note: 'We have your application and documents.' },
  { key: 'kyc', label: 'KYC verification', note: 'Identity and address are verified against your documents.' },
  { key: 'review', label: 'Credit & risk review', note: 'Underwriting and risk checks are in progress.' },
  { key: 'approval', label: 'Approved', note: 'Your terms are ready. Review and accept the offer.' },
  { key: 'active', label: 'Account active', note: 'Your product is live. Welcome to Fermor.' },
] as const

/* ---------- Content ---------- */
export const insights = [
  { cat: 'Investing', title: 'SIP vs lumpsum: how to decide when markets look expensive', mins: 6, blurb: 'A framework for staggering entries without trying to time the market.' },
  { cat: 'Investing', title: 'Asset allocation by life stage: a practical starting point', mins: 8, blurb: 'How equity, debt and gold mixes change from your 20s to retirement.' },
  { cat: 'Borrowing', title: 'Fixed vs floating home-loan rates in a changing cycle', mins: 7, blurb: 'What really moves your EMI and when switching or prepaying makes sense.' },
  { cat: 'Borrowing', title: 'Your credit score, explained: five levers you control', mins: 5, blurb: 'Utilisation, repayment history, enquiries, mix and age — in plain language.' },
  { cat: 'Protection', title: 'How much term cover do you actually need?', mins: 6, blurb: 'A simple human-life-value method with an inflation check.' },
  { cat: 'Planning', title: 'Tax-smart investing: ELSS, NPS, PPF and FDs compared', mins: 9, blurb: 'Lock-ins, taxation and who each option suits best.' },
] as const

export const faqs: [string, string][] = [
  ['Is my money and data safe?', 'Fermor uses encryption in transit and at rest, device binding, step-up authentication for sensitive actions and continuous fraud monitoring. We never ask for your PIN, OTP or password over phone, email or chat.'],
  ['How long does account opening take?', 'Typically under 10 minutes to apply. Video KYC and verification usually complete within one working day; loans add a credit and risk review of 24–72 hours.'],
  ['What documents will I need?', 'PAN, an address proof (Aadhaar, passport or driving licence), and for loans recent income proof or bank statements. Business loans also need GST and business-proof documents.'],
  ['Are the rates and returns guaranteed?', 'Loan and deposit rates shown are indicative and depend on your profile and tenure. Mutual-fund and market-linked returns are not guaranteed; past performance does not predict future results.'],
  ['Can I track my application?', 'Yes. Use the tracker with your reference ID or email to see each stage from KYC to activation.'],
  ['Does this demo store my data?', 'In this demo build, applications and preferences are saved only in your own browser (localStorage). Sensitive fields such as PAN are never stored. Connect the portal to your backend before real use.'],
]

export const inr = (n: number, compact = false) => {
  if (compact) {
    if (Math.abs(n) >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.00$/, '') + ' Cr'
    if (Math.abs(n) >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.00$/, '') + ' L'
  }
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
export const productById = (id: string) => products.find(p => p.id === id)
