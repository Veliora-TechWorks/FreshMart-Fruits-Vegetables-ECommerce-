'use client'

import { createContext, useContext, ReactNode } from 'react'

interface CurrencyContextType {
  formatPrice: (price: number) => string
  currency: string
}

const IndianCurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function IndianCurrencyProvider({ children }: { children: ReactNode }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <IndianCurrencyContext.Provider value={{ formatPrice, currency: 'INR' }}>
      {children}
    </IndianCurrencyContext.Provider>
  )
}

export function useIndianCurrency() {
  const context = useContext(IndianCurrencyContext)
  if (!context) throw new Error('useIndianCurrency must be used within IndianCurrencyProvider')
  return context
}