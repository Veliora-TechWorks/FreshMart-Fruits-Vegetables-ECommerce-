'use client'

import { useState } from 'react'
import AdvancedProductCard from './AdvancedProductCard'
import { Product } from '@/types/product'

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Bananas',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
    price: 60,
    mrp: 80,
    unitOptions: [
      { value: 1, label: '1 Dozen (12 pcs)', multiplier: 1 },
      { value: 0.5, label: '6 pcs', multiplier: 0.5 },
      { value: 2, label: '2 Dozen (24 pcs)', multiplier: 2 }
    ],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isBestSeller: true,
    isFresh: true,
    stockLevel: 'high',
    freshnessScore: 95,
    isRecommended: true
  },
  {
    id: '2',
    name: 'Premium Red Apples',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
    price: 120,
    mrp: 150,
    unitOptions: [
      { value: 1, label: '1 kg', multiplier: 1 },
      { value: 0.5, label: '500g', multiplier: 0.5 },
      { value: 2, label: '2 kg', multiplier: 2 }
    ],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    isOrganic: true,
    isSeasonal: true,
    isBestSeller: false,
    isFresh: true,
    stockLevel: 'medium',
    freshnessScore: 92
  },
  {
    id: '3',
    name: 'Fresh Spinach Leaves',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop',
    price: 40,
    mrp: 50,
    unitOptions: [
      { value: 1, label: '250g Bundle', multiplier: 1 },
      { value: 2, label: '500g Bundle', multiplier: 2 }
    ],
    rating: 4.3,
    reviews: 45,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isBestSeller: false,
    isFresh: true,
    stockLevel: 'low',
    freshnessScore: 88
  },
  {
    id: '4',
    name: 'Exotic Dragon Fruit',
    category: 'Exotic Fruits',
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=300&h=300&fit=crop',
    price: 200,
    mrp: 200,
    unitOptions: [
      { value: 1, label: '1 piece', multiplier: 1 },
      { value: 2, label: '2 pieces', multiplier: 2 }
    ],
    rating: 4.6,
    reviews: 23,
    inStock: false,
    isOrganic: false,
    isSeasonal: true,
    isBestSeller: false,
    isFresh: false,
    stockLevel: 'out'
  }
]

export default function AdvancedProductCardDemo() {
  const [selectedVariant, setSelectedVariant] = useState<'compact' | 'standard' | 'horizontal'>('standard')

  const handleQuickView = (product: Product) => {
    alert(`Quick view for: ${product.name}`)
  }

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    console.log(`Product ${productId} ${isWishlisted ? 'added to' : 'removed from'} wishlist`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Product Card Demo</h1>
          <p className="text-gray-600 mb-6">
            Fully functional product cards with quantity management, unit selection, wishlist, and cart integration.
          </p>
          
          {/* Variant Selector */}
          <div className="flex gap-4 mb-8">
            <label className="text-sm font-medium text-gray-700">Card Variant:</label>
            <div className="flex gap-2">
              {(['compact', 'standard', 'horizontal'] as const).map(variant => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedVariant === variant
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`grid gap-6 ${
          selectedVariant === 'horizontal' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : selectedVariant === 'compact'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {sampleProducts.map(product => (
            <AdvancedProductCard
              key={product.id}
              product={product}
              variant={selectedVariant}
              onQuickView={handleQuickView}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>

        {/* Features List */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Quantity Management</h3>
              <p className="text-sm text-gray-600">Full cart integration with add/remove quantity controls</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Unit Selection</h3>
              <p className="text-sm text-gray-600">Multiple unit options with dynamic pricing</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Smart Badges</h3>
              <p className="text-sm text-gray-600">Organic, Fresh, Best Seller, Seasonal indicators</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Stock Management</h3>
              <p className="text-sm text-gray-600">Real-time stock levels and availability</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Wishlist Integration</h3>
              <p className="text-sm text-gray-600">Add/remove from wishlist with visual feedback</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Quick view, wishlist toggle, and quantity shortcuts</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Responsive Design</h3>
              <p className="text-sm text-gray-600">Multiple card variants for different layouts</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Freshness Score</h3>
              <p className="text-sm text-gray-600">Visual freshness indicator for produce</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Smooth Animations</h3>
              <p className="text-sm text-gray-600">Hover effects and smooth transitions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}