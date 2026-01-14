'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, Star, X } from 'lucide-react'
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
  organic: boolean
  rating: number
}

export default function ProductsClient({ initialProducts }: { initialProducts: DBProduct[] }) {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = useMemo(() => [
    { id: 'all', label: 'All', count: initialProducts.length },
    { id: 'fruits', label: 'Fruits', count: initialProducts.filter(p => p.category === 'fruits').length },
    { id: 'vegetables', label: 'Vegetables', count: initialProducts.filter(p => p.category === 'vegetables').length },
    { id: 'organic', label: 'Organic', count: initialProducts.filter(p => p.organic).length }
  ], [initialProducts])

  const filteredProducts = useMemo(() => 
    initialProducts.filter(p => {
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'organic' ? p.organic : p.category === selectedCategory)
      const matchesSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    }), [initialProducts, selectedCategory, searchTerm])

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold">{filteredProducts.length}</span> products found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border">
                
                <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-2xl">
                  <Image
                    src={product.images[0]?.url || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.organic && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Organic
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="text-xs text-gray-400">({product.stock} left)</span>
                  </div>

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
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
