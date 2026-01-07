'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import AdvancedProductCard from './AdvancedProductCard'
import { Product } from '@/types/product'
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
  reviews: Array<any>
  brand?: string
  deliveryTime?: string
  offerText?: string
}

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<DBProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const categories = [
    { id: 'all', label: 'All Products', count: Array.isArray(products) ? products.length : 0 },
    { id: 'fruits', label: 'Fresh Fruits', count: Array.isArray(products) ? products.filter((p: DBProduct) => p.category === 'fruits').length : 0 },
    { id: 'vegetables', label: 'Vegetables', count: Array.isArray(products) ? products.filter((p: DBProduct) => p.category === 'vegetables').length : 0 },
    { id: 'organic', label: 'Organic', count: Array.isArray(products) ? products.filter((p: DBProduct) => p.organic).length : 0 }
  ]

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'organic') return product.organic
    return product.category === activeCategory
  }).slice(0, 8) : []

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 xl:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 sm:px-4 md:px-5 xl:py-3 rounded-full text-xs sm:text-sm xl:text-base font-medium mb-3 md:mb-4 xl:mb-6">
            <Sparkles size={12} className="sm:size-[14px] md:size-4 xl:size-5" />
            <span>Premium Quality</span>
          </div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 xl:mb-8 px-2 sm:px-4">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base md:text-xl xl:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            Discover our handpicked selection of the freshest, highest-quality organic produce 
            <span className="hidden sm:inline">sourced directly from trusted local farms</span>
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products available yet.</p>
            <p className="text-gray-400">Products added from the admin dashboard will appear here.</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="px-2 sm:px-4 mb-6 sm:mb-8 md:mb-12 xl:mb-16">
              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
                      activeCategory === category.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {category.label}
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Tablet & Desktop: Centered grid */}
              <div className="hidden md:flex flex-wrap justify-center gap-3 xl:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2.5 md:px-6 md:py-3 xl:px-8 xl:py-4 text-sm md:text-base xl:text-lg rounded-full font-medium transition-all duration-200 min-h-[44px] ${
                      activeCategory === category.id
                        ? 'bg-primary text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-md'
                    }`}
                  >
                    {category.label}
                    <span className={`ml-2 text-xs xl:text-sm px-2 py-1 xl:px-3 xl:py-1.5 rounded-full ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="px-2 sm:px-4">
              {/* Mobile: 1 column */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {filteredProducts.slice(0, 4).map((dbProduct, index) => {
                  const product = convertToAdvancedProduct(dbProduct)
                  return (
                    <div 
                      key={dbProduct._id}
                      className="transform hover:scale-[1.02] transition-transform duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AdvancedProductCard
                        product={product}
                        variant="standard"
                        onWishlistToggle={(productId, isWishlisted) => toggleWishlist(productId)}
                      />
                    </div>
                  )
                })}
              </div>
              
              {/* Small Mobile & Tablet: 2 columns */}
              <div className="hidden sm:grid md:hidden grid-cols-2 gap-4 sm:gap-6">
                {filteredProducts.slice(0, 6).map((dbProduct, index) => {
                  const product = convertToAdvancedProduct(dbProduct)
                  return (
                    <div 
                      key={dbProduct._id}
                      className="transform hover:scale-[1.02] transition-transform duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AdvancedProductCard
                        product={product}
                        variant="standard"
                        onWishlistToggle={(productId, isWishlisted) => toggleWishlist(productId)}
                      />
                    </div>
                  )
                })}
              </div>
              
              {/* Desktop & Laptop: 3-4 columns */}
              <div className="hidden md:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:grid-cols-2 gap-4 md:gap-6 xl:gap-8">
                {filteredProducts.map((dbProduct, index) => {
                  const product = convertToAdvancedProduct(dbProduct)
                  return (
                    <div 
                      key={dbProduct._id}
                      className="transform hover:scale-[1.02] transition-transform duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AdvancedProductCard
                        product={product}
                        variant="standard"
                        onWishlistToggle={(productId, isWishlisted) => toggleWishlist(productId)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 sm:mt-12 md:mt-16 xl:mt-20 px-2 sm:px-4">
              <div className="bg-white rounded-xl md:rounded-2xl xl:rounded-3xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 xl:p-12 max-w-xl sm:max-w-2xl xl:max-w-4xl mx-auto border border-gray-100">
                <h3 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 xl:mb-6">
                  Explore Our Full Collection
                </h3>
                <p className="text-sm sm:text-base xl:text-lg text-gray-600 mb-4 sm:mb-6 xl:mb-8">
                  Browse through our complete range of fresh, organic produce
                  <span className="hidden sm:inline"> and discover seasonal specialties handpicked just for you</span>.
                </p>
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 xl:px-10 xl:py-5 text-sm sm:text-base xl:text-lg rounded-full font-semibold hover:bg-primary/90 transition-colors group w-full sm:w-auto justify-center min-h-[44px]"
                >
                  <span>View All Products</span>
                  <ArrowRight size={16} className="sm:size-[18px] md:size-5 xl:size-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}