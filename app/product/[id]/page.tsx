'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, Leaf, Award, ArrowLeft } from 'lucide-react'
import { useCurrency } from '@/components/CurrencyContext'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Recommendations from '@/components/Recommendations'
import Link from 'next/link'

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

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<DBProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedUnit, setSelectedUnit] = useState({ value: 1, label: '1 kg', multiplier: 1 })
  const [quantity, setQuantity] = useState(0)
  const [showQuantity, setShowQuantity] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  
  const { convertPrice } = useCurrency()
  const { addToCart } = useCart()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        setSelectedUnit({ value: 1, label: `1 ${data.unit}`, multiplier: 1 })
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary hover:underline">Back to Products</Link>
        </div>
        <Footer />
      </main>
    )
  }

  const unitOptions = [
    { value: 0.5, label: `0.5 ${product.unit}`, multiplier: 0.5 },
    { value: 1, label: `1 ${product.unit}`, multiplier: 1 },
    { value: 2, label: `2 ${product.unit}`, multiplier: 2 }
  ]

  const currentPrice = product.price * selectedUnit.multiplier
  const currentMrp = (product.originalPrice || product.price) * selectedUnit.multiplier
  const discountPercent = product.originalPrice && product.originalPrice > product.price ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0

  const handleFirstClick = () => {
    setQuantity(1)
    setShowQuantity(true)
  }

  const handleAddToCart = () => {
    const cartProduct = {
      id: product._id,
      name: product.name,
      category: product.category,
      image: product.images[0]?.url || '',
      price: product.price,
      mrp: product.originalPrice || product.price,
      unitOptions: unitOptions,
      rating: product.rating || 0,
      reviews: product.reviews?.length || 0,
      inStock: product.stock > 0,
      isOrganic: product.organic,
      isSeasonal: false,
      isBestSeller: product.featured,
      isFresh: true,
      stockLevel: product.stock > 10 ? 'high' as const : product.stock > 5 ? 'medium' as const : product.stock > 0 ? 'low' as const : 'out' as const,
      selectedUnit
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct)
    }
    setQuantity(0)
    setShowQuantity(false)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => {
    const newQuantity = Math.max(0, quantity - 1)
    setQuantity(newQuantity)
    if (newQuantity === 0) {
      setShowQuantity(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl p-6 shadow-sm">
              <img
                src={product.images[selectedImage]?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              
              {/* Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                {product.organic && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Leaf size={12} /> Organic
                  </span>
                )}
                {product.featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award size={12} /> Best Seller
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-white">
                  <Star size={14} className="fill-current" />
                  <span className="font-semibold text-sm">{product.rating || 0}</span>
                </div>
                <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Shield size={12} />
                  FreshMart Assured
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-800">{convertPrice(currentPrice)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">{convertPrice(currentMrp)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-gray-600">Price per {selectedUnit.label} • Inclusive of all taxes</p>
            </div>

            {/* Unit Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Choose Weight</h3>
              <div className="grid grid-cols-3 gap-3">
                {unitOptions.map((unit) => (
                  <button
                    key={unit.value}
                    onClick={() => setSelectedUnit(unit)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedUnit.value === unit.value
                        ? 'border-primary bg-primary/10 text-primary shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-semibold">{unit.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{convertPrice(product.price * unit.multiplier)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.deliveryTime || 'Fast Delivery Available'}</span>
                {product.offerText && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-primary font-medium">{product.offerText}</span>
                  </>
                )}
              </div>

              {!showQuantity ? (
                <button
                  onClick={handleFirstClick}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-4">
                    <button 
                      onClick={decrementQuantity}
                      className="w-12 h-12 bg-red-500 text-white rounded-full font-bold text-xl hover:bg-red-600 transition-all shadow-md"
                    >
                      −
                    </button>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{quantity}</div>
                      <div className="text-sm text-gray-500">Quantity</div>
                    </div>
                    <button 
                      onClick={incrementQuantity}
                      className="w-12 h-12 bg-green-500 text-white rounded-full font-bold text-xl hover:bg-green-600 transition-all shadow-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <ShoppingCart size={24} />
                    Add {quantity} to Cart • {convertPrice(currentPrice * quantity)}
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full mt-4 py-3 px-6 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium ${
                  isWishlisted 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-primary" />
                Delivery & Returns
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 font-medium">Delivery by tomorrow 6 PM</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-800 font-medium">Cash on delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['description', 'nutrition', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About this product</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Product Details</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Category: {product.category}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Unit: {product.unit}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Stock: {product.stock} available</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{product.organic ? 'Organic' : 'Conventional'}</span>
                    </div>
                    {product.featured && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">Featured Product</span>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">Brand: {product.brand}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Nutrition Information</h3>
                <p className="text-gray-600">Detailed nutrition information will be available soon.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review: any, index: number) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">{review.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div>
                            <div className="font-medium">{review.name || 'Anonymous'}</div>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating || 5)].map((_, i) => (
                                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment || 'Great product!'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <Recommendations 
        title="You might also like" 
        currentProductId={product._id}
        limit={4}
      />

      <Footer />
    </main>
  )
}