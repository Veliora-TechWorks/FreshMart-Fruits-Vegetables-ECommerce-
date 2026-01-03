'use client'

import { createContext, useContext, ReactNode } from 'react'

type Currency = {
  code: string
  symbol: string
  rate: number
  country: string
}

const currency: Currency = { code: 'INR', symbol: '₹', rate: 1, country: 'India' }

type CurrencyContextType = {
  currency: Currency
  convertPrice: (price: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const convertPrice = (price: number): string => {
    const converted = (price * 83).toFixed(0) // Convert USD to INR
    return `₹${converted}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}