'use client'

import { useState, useEffect } from 'react'
import AdvancedProductCard from './AdvancedProductCard'
import { Product } from '@/types/product'

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
  reviews: Array<any>
}

interface RecommendationsProps {
  title?: string
  currentProductId?: string
  category?: string
  limit?: number
}

export default function Recommendations({ 
  title = "Recommended for You", 
  currentProductId,
  category,
  limit = 4 
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<DBProduct[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [currentProductId, category])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/products')
      const products = await response.json()
      
      // Simple recommendation logic
      let filtered = products.filter((p: DBProduct) => p._id !== currentProductId)
      
      if (category) {
        filtered = filtered.filter((p: DBProduct) => p.category === category)
      }
      
      // Sort by rating and take limited results
      const sorted = filtered
        .sort((a: DBProduct, b: DBProduct) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit)
      
      setRecommendations(sorted)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const convertToAdvancedProduct = (dbProduct: DBProduct): Product => {
    return {
      id: dbProduct._id,
      name: dbProduct.name,
      category: dbProduct.category,
      image: dbProduct.images[0]?.url || '',
      price: dbProduct.price,
      mrp: dbProduct.originalPrice || dbProduct.price,
      unitOptions: [
        { value: 1, label: `1 ${dbProduct.unit}`, multiplier: 1 },
        { value: 0.5, label: `0.5 ${dbProduct.unit}`, multiplier: 0.5 },
        { value: 2, label: `2 ${dbProduct.unit}`, multiplier: 2 }
      ],
      rating: dbProduct.rating || 0,
      reviews: dbProduct.reviews?.length || 0,
      inStock: dbProduct.stock > 0,
      isOrganic: dbProduct.organic,
      isSeasonal: false,
      isBestSeller: dbProduct.featured,
      isFresh: true,
      stockLevel: dbProduct.stock > 10 ? 'high' : dbProduct.stock > 5 ? 'medium' : dbProduct.stock > 0 ? 'low' : 'out',
      freshnessScore: 90 + Math.floor(Math.random() * 10),
      isRecommended: dbProduct.featured
    }
  }

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) return null

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-heading mb-6">{title}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((dbProduct) => {
              const product = convertToAdvancedProduct(dbProduct)
              return (
                <AdvancedProductCard
                  key={dbProduct._id}
                  product={product}
                  variant="compact"
                  onQuickView={(product) => {
                    console.log('Quick view:', product.name)
                  }}
                  onWishlistToggle={(productId, isWishlisted) => {
                    console.log(`Product ${productId} ${isWishlisted ? 'added to' : 'removed from'} wishlist`)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}