'use client'

import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getTotalItems } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">🌿 FreshMart</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-heading hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="text-heading hover:text-primary transition-colors">Products</Link>
            <Link href="/about" className="text-heading hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="text-heading hover:text-primary transition-colors">Contact</Link>
          </nav>

          {/* Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="btn-primary flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span>Cart ({getTotalItems()})</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-heading hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-heading hover:text-primary">Home</Link>
              <Link href="/products" className="block px-3 py-2 text-heading hover:text-primary">Products</Link>
              <Link href="/about" className="block px-3 py-2 text-heading hover:text-primary">About Us</Link>
              <Link href="/contact" className="block px-3 py-2 text-heading hover:text-primary">Contact</Link>
              <Link href="/cart" className="btn-primary w-full mt-4 flex items-center justify-center space-x-2">
                <ShoppingCart size={20} />
                <span>Cart ({getTotalItems()})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}