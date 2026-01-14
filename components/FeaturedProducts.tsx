'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import { useCart } from './CartContext'

interface DBProduct {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: Array<{ url: string; alt?: string }>
  stock: number
  unit: string
  featured: boolean
  organic: boolean
  rating: number
}

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<DBProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles size={16} />
            <span>Fresh & Organic</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked fresh produce delivered to your doorstep
          </p>
        </div>

        {/* Products Grid */}
        {Array.isArray(products) && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(0, 8).map((product) => (
            <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                {product.organic && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Organic
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.rating || 4.5}</span>
                  <span className="text-xs text-gray-400">({product.stock} in stock)</span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{product.price}
                      <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0]?.url || '',
                      category: product.category,
                      mrp: product.originalPrice || product.price,
                      unitOptions: [{ value: 1, label: product.unit, multiplier: 1 }],
                      rating: product.rating,
                      reviews: 0,
                      inStock: product.stock > 0,
                      isOrganic: product.organic,
                      isSeasonal: false,
                      selectedUnit: { value: 1, label: product.unit, multiplier: 1 }
                    })}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
