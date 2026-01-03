'use client'

import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { useCurrency } from '@/components/CurrencyContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { convertPrice } = useCurrency()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-heading mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some fresh produce to get started!</p>
            <Link href="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
        
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-heading">Shopping Cart</h1>
          <span className="text-gray-600">({items.length} items)</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.weight}`} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-heading text-lg">{item.name}</h3>
                        <p className="text-gray-600">Weight: {item.weight}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {convertPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {convertPrice(item.price)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
              <Link href="/products" className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-heading mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{convertPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-primary">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-heading">Total</span>
                    <span className="font-bold text-primary">{convertPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors mb-4">
                Proceed to Checkout
              </button>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}