'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/types/product'

interface CartItem extends Product {
  selectedUnit: {
    value: number
    label: string
    multiplier: number
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product & { selectedUnit: any }) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  getCartQuantity: (productId: string) => number
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product & { selectedUnit: any }) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.selectedUnit.value === product.selectedUnit.value
      )
      
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id && item.selectedUnit.value === product.selectedUnit.value
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== productId))
    } else {
      setItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => {
      const item = prev.find(item => item.id === productId)
      if (!item) return prev
      
      if (item.quantity === 1) {
        return prev.filter(item => item.id !== productId)
      }
      
      return prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    })
  }

  const getCartQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const clearCart = () => setItems([])

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0)

  const getTotalPrice = () => items.reduce((total, item) => 
    total + (item.price * item.selectedUnit.multiplier * item.quantity), 0
  )

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}