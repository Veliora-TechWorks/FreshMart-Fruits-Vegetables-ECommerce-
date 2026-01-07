'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { sampleProducts } from '@/data/sampleProducts'
import { CardVariant } from '@/types/product'

export default function ProductCardDemo() {
  const [wishlist, setWishlist] = useState<string[]>([])

  const handleWishlistToggle = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const variants: { name: string; variant: CardVariant; description: string }[] = [
    { name: 'Standard Card', variant: 'standard', description: 'Full-featured card for category pages' },
    { name: 'Compact Card', variant: 'compact', description: 'Smaller card for homepage sliders' },
    { name: 'Horizontal Card', variant: 'horizontal', description: 'Side-by-side layout for cart upsells' },
    { name: 'Minimal Card', variant: 'minimal', description: 'Simplified card for recommendations' },
    { name: 'Admin Preview', variant: 'admin', description: 'Admin interface preview card' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-heading mb-4">FreshMart Product Cards</h1>
          <p className="text-lg text-gray-600">Comprehensive product card system with multiple variants</p>
        </div>

        {variants.map(({ name, variant, description }) => (
          <section key={variant} className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-heading mb-2">{name}</h2>
              <p className="text-gray-600">{description}</p>
            </div>

            <div className={`grid gap-6 ${
              variant === 'horizontal' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : variant === 'compact' || variant === 'minimal'
                ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
                : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {sampleProducts.slice(0, variant === 'horizontal' ? 3 : 6).map((product) => (
                <ProductCard
                  key={`${variant}-${product.id}`}
                  product={product}
                  variant={variant}
                  onWishlistToggle={handleWishlistToggle}
                  isWishlisted={wishlist.includes(product.id)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Feature Showcase */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-heading mb-8">Feature Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">🛒 Smart Cart Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add button transforms to quantity controls</li>
                <li>• Persistent cart state across pages</li>
                <li>• Unit-based quantity tracking</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">🤍 Wishlist Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Toggle wishlist with heart icon</li>
                <li>• Visual feedback animations</li>
                <li>• Cross-device synchronization ready</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">🎯 Smart Badges</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Organic, Fresh, Best Seller tags</li>
                <li>• Dynamic discount calculations</li>
                <li>• Stock level indicators</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">📱 Responsive Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-first approach</li>
                <li>• Touch-friendly interactions</li>
                <li>• Keyboard accessible</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">⚡ Performance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Lazy loading images</li>
                <li>• Optimized animations</li>
                <li>• Minimal re-renders</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold text-heading mb-3">🧠 AI Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Freshness scoring</li>
                <li>• Recommendation tags</li>
                <li>• Smart quantity suggestions</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}