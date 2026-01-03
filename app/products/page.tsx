'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter, Grid, List, Star, Heart, Eye, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCurrency } from '@/components/CurrencyContext'

import ProductCard from '@/components/ProductCard'

const allProducts = [
  {
    id: 1, name: 'Fresh Red Apples', price: 4.99, originalPrice: 5.99, category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8, reviews: 124, stock: 15, organic: true, discount: 17
  },
  {
    id: 2, name: 'Organic Tomatoes', price: 3.49, originalPrice: 3.99, category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6, reviews: 89, stock: 8, organic: true, discount: 13
  },
  {
    id: 3, name: 'Ripe Bananas', price: 2.99, originalPrice: null, category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9, reviews: 156, stock: 22, organic: false, discount: null
  },
  {
    id: 4, name: 'Fresh Carrots', price: 2.49, originalPrice: 2.99, category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7, reviews: 67, stock: 3, organic: true, discount: 17
  },
  {
    id: 5, name: 'Green Broccoli', price: 3.99, originalPrice: null, category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5, reviews: 43, stock: 12, organic: true, discount: null
  },
  {
    id: 6, name: 'Fresh Spinach', price: 2.79, originalPrice: 3.29, category: 'Leafy Greens',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4, reviews: 91, stock: 0, organic: true, discount: 15
  },
  {
    id: 7, name: 'Mixed Berries', price: 6.99, originalPrice: 7.99, category: 'Berries',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9, reviews: 203, stock: 18, organic: true, discount: 13
  },
  {
    id: 8, name: 'Fresh Oranges', price: 3.99, originalPrice: null, category: 'Citrus',
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6, reviews: 78, stock: 25, organic: false, discount: null
  }
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cart, setCart] = useState<{[key: number]: number}>({})
  const [wishlist, setWishlist] = useState<number[]>([])
  const { convertPrice } = useCurrency()

  const categories = ['All', 'Fruits', 'Vegetables', 'Leafy Greens', 'Berries', 'Citrus', 'Tropical', 'Herbs', 'Organic']
  
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      const categoryMap: {[key: string]: string} = {
        'fruits': 'Fruits',
        'vegetables': 'Vegetables', 
        'leafy-greens': 'Leafy Greens',
        'berries': 'Berries',
        'citrus': 'Citrus',
        'tropical': 'Tropical',
        'herbs': 'Herbs',
        'organic': 'Organic'
      }
      setSelectedCategory(categoryMap[categoryParam] || 'All')
    }
  }, [searchParams])
  
  const filteredProducts = allProducts
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        default: return a.name.localeCompare(b.name)
      }
    })

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
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fresh Products</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover our complete range of fresh, organic fruits and vegetables
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => {
              return viewMode === 'grid' ? (
                <ProductCard
                  key={product.id}
                  product={product}
                  cart={cart}
                  wishlist={wishlist}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onToggleWishlist={toggleWishlist}
                />
              ) : (
                // List View
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
                  <div className="flex gap-4">
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-heading">{product.name}</h3>
                        <button onClick={() => toggleWishlist(product.id)} className={`p-1 rounded ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}>
                          <Heart size={16} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'text-yellow fill-current' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{convertPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">{convertPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        {cart[product.id] === 0 || !cart[product.id] ? (
                          <button onClick={() => addToCart(product.id)} disabled={product.stock === 0} className={`px-4 py-2 rounded-lg font-medium ${product.stock === 0 ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:bg-primary/90'}`}>
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Minus size={14} />
                            </button>
                            <span className="font-semibold">{cart[product.id]}</span>
                            <button onClick={() => addToCart(product.id)} className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}