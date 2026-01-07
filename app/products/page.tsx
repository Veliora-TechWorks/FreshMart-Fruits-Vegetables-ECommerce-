'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdvancedProductCard from '@/components/AdvancedProductCard'
import { Product } from '@/types/product'
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartContext'

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

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<DBProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    // Seed database if empty
    seedIfEmpty()
  }, [])

  const seedIfEmpty = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        await fetch('/api/seed', { method: 'POST' })
        fetchProducts()
      }
    } catch (error) {
      console.error('Error checking/seeding products:', error)
    }
  }

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam) setSelectedCategory(categoryParam)
    if (searchParam) setSearchTerm(searchParam)
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
      if (data.length > 0) {
        const maxPrice = Math.max(...data.map((p: DBProduct) => p.price))
        setPriceRange([0, maxPrice])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const convertToAdvancedProduct = (dbProduct: DBProduct): Product => {
    return {
      id: dbProduct._id,
      name: dbProduct.name,
      category: dbProduct.category,
      image: dbProduct.images?.[0]?.url || '/placeholder-product.jpg',
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
      isOrganic: dbProduct.organic || false,
      isSeasonal: false,
      isBestSeller: dbProduct.featured || false,
      isFresh: true,
      stockLevel: dbProduct.stock > 10 ? 'high' as const : dbProduct.stock > 5 ? 'medium' as const : dbProduct.stock > 0 ? 'low' as const : 'out' as const,
      freshnessScore: 90 + Math.floor(Math.random() * 10),
      isRecommended: dbProduct.featured || false
    }
  }

  const categories = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'fruits', label: 'Fresh Fruits', count: products.filter(p => p.category === 'fruits').length },
    { id: 'vegetables', label: 'Vegetables', count: products.filter(p => p.category === 'vegetables').length },
    { id: 'herbs', label: 'Fresh Herbs', count: products.filter(p => p.category === 'herbs').length },
    { id: 'organic', label: 'Organic Only', count: products.filter(p => p.organic).length }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ]
  
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'organic' ? product.organic : product.category === selectedCategory)
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesCategory && matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        default: return a.name.localeCompare(b.name)
      }
    })

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchTerm('')
    setPriceRange([0, Math.max(...products.map(p => p.price)) || 1000])
  }

  const activeFiltersCount = [
    selectedCategory !== 'all',
    searchTerm !== '',
    priceRange[1] !== (Math.max(...products.map(p => p.price)) || 1000)
  ].filter(Boolean).length

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Title & Breadcrumb */}
            <div className="space-y-2">
              <nav className="text-sm text-gray-500">
                <span>Home</span> / <span>Products</span>
                {selectedCategory !== 'all' && (
                  <> / <span className="text-primary font-medium">{categories.find(c => c.id === selectedCategory)?.label}</span></>
                )}
              </nav>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.label}
                </h1>
                <p className="text-gray-600 mt-1">
                  Premium quality produce from trusted local farms
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 mb-4"
          >
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <SlidersHorizontal size={18} />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </span>
            <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={18} />
          </button>

          {/* Filters Content */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 lg:hidden">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300'
                    }`}
                  >
                    {category.label}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
              
              {/* Price Range */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(...products.map(p => p.price)) || 1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 accent-primary"
                />
              </div>

              {/* Sort & View Controls */}
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-primary hover:bg-primary/5 border border-primary rounded-lg transition-colors"
                  >
                    Clear ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              {searchTerm && (
                <span> for "<span className="font-medium">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={28} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {filteredProducts.map((dbProduct) => {
                const product = convertToAdvancedProduct(dbProduct)
                return (
                  <AdvancedProductCard
                    key={dbProduct._id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'standard'}
                    onWishlistToggle={(productId, isWishlisted) => toggleWishlist(productId)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* No Recommendations section for now */}

      <Footer />
    </main>
  )
}