'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  weight: string
  weightMultiplier: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, weight?: any) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: any, weight = { label: '1kg', multiplier: 1 }) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.weight === weight.label)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.weight === weight.label
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price * weight.multiplier,
        image: product.image,
        quantity: 1,
        weight: weight.label,
        weightMultiplier: weight.multiplier
      }]
    })
  }

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
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
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}