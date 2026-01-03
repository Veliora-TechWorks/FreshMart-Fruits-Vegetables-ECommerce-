'use client'

import { useState } from 'react'
import { useCurrency } from './CurrencyContext'
import Link from 'next/link'
import ProductCard from './ProductCard'

const products = [
  {
    id: 1,
    name: 'Fresh Apples',
    price: 4.99,
    originalPrice: 5.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 124,
    stock: 15,
    organic: true,
    discount: 17
  },
  {
    id: 2,
    name: 'Organic Tomatoes',
    price: 3.49,
    originalPrice: 3.99,
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 89,
    stock: 8,
    organic: true,
    discount: 13
  },
  {
    id: 3,
    name: 'Ripe Bananas',
    price: 2.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 156,
    stock: 22,
    organic: false,
    discount: null
  },
  {
    id: 4,
    name: 'Fresh Carrots',
    price: 2.49,
    originalPrice: 2.99,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 67,
    stock: 3,
    organic: true,
    discount: 17
  },
  {
    id: 5,
    name: 'Green Broccoli',
    price: 3.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 43,
    stock: 12,
    organic: true,
    discount: null
  },
  {
    id: 6,
    name: 'Fresh Spinach',
    price: 2.79,
    originalPrice: 3.29,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviews: 91,
    stock: 0,
    organic: true,
    discount: 15
  }
]

export default function FeaturedProducts() {
  const [cart, setCart] = useState<{[key: number]: number}>({})
  const [wishlist, setWishlist] = useState<number[]>([])

  const addToCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: Math.max((prev[productId] || 0) - 1, 0) }))
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <section id="products" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
            Featured Products
          </h2>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of the freshest, highest-quality organic produce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart={cart}
              wishlist={wishlist}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}