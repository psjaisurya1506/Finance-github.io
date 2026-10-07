'use client'
import { useCallback, useEffect, useState } from 'react'

export type Application = {
  ref: string
  productId: string
  productName: string
  amount: number
  name: string
  email: string
  submittedAt: string
  stage: number
}
export type User = { name: string; email: string }

/** localStorage-backed state that hydrates after mount (SSR-safe). */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setValue(JSON.parse(raw))
    } catch {}
  }, [key])
  const set = useCallback((next: T | ((p: T) => T)) => {
    setValue(prev => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      try { window.localStorage.setItem(key, JSON.stringify(v)) } catch {}
      return v
    })
  }, [key])
  return [value, set] as const
}
