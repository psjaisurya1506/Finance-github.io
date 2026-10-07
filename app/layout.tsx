import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fermor Financial · Invest, Borrow, Protect, Bank',
  description: 'Fermor Financial portal — investing, loans, insurance and banking with calculators, markets watchlist, client dashboard and application tracking.',
}
export const viewport: Viewport = { themeColor: '#06110e' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>
}
