import { Landmark } from 'lucide-react'

const cols: [string, string[][]][] = [
  ['Products', [['#products', 'Invest'], ['#products', 'Borrow'], ['#products', 'Protect'], ['#products', 'Bank']]],
  ['Tools', [['#calculators', 'Calculators'], ['#markets', 'Markets'], ['#dashboard', 'Dashboard'], ['#insights', 'Insights']]],
  ['Support', [['#track', 'Track application'], ['#faq', 'FAQ'], ['#contact', 'Contact us'], ['#security', 'Security']]],
]
export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#040b09] py-14"><div className="mx-auto max-w-7xl px-6">
    <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><a href="#top" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-2 to-gold text-ink"><Landmark className="h-5 w-5" /></span><span className="font-display text-xl font-semibold text-paper">Fermor Financial</span></a><p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-500">Investing, lending, insurance and banking — built on transparency, security and long-term client outcomes.</p></div>
      {cols.map(([t, items]) => <div key={t}><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold">{t}</p><ul className="mt-4 space-y-3 text-[13px] text-slate-400">{items.map(([h, l]) => <li key={l}><a href={h} className="transition hover:text-paper">{l}</a></li>)}</ul></div>)}
    </div>
    <div className="mt-12 space-y-2 border-t border-white/10 pt-6 text-[11px] leading-5 text-slate-600">
      <p>© Fermor Financial · Demo portal. Fermor is an illustrative company; products, rates, balances and market quotes are sample content and not an offer. Investments in securities are subject to market risks; read all related documents carefully. Past performance is not indicative of future returns. Loans are subject to credit approval.</p>
    </div>
  </div></footer>
}
