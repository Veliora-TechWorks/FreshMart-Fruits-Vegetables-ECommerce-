'use client'

import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingCart, Plus, Minus, MapPin, Truck, Shield, Leaf } from 'lucide-react'
import { useCurrency } from '@/components/CurrencyContext'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const productData = {
  id: 1,
  name: 'Fresh Organic Red Apples',
  images: [
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  rating: 4.8,
  reviews: 1247,
  price: 4.99,
  originalPrice: 5.99,
  discount: 17,
  organic: true,
  stock: 25,
  harvestDate: '2024-01-15',
  highlights: [
    'Certified Organic',
    'Farm Fresh - Harvested 2 days ago',
    'Rich in Fiber & Vitamin C',
    'No Pesticides or Chemicals',
    'Hand-picked for Quality'
  ],
  storage: 'Store in refrigerator for up to 2 weeks'
}

const customerReviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-10',
    comment: 'Absolutely fresh and delicious! The apples were crisp and sweet. Great quality for the price.',
    verified: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 4,
    date: '2024-01-08',
    comment: 'Good quality apples, delivered fresh. Only minor issue was one apple had a small bruise.',
    verified: true
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 5,
    date: '2024-01-05',
    comment: 'Perfect for my kids lunch boxes. Organic and tasty. Will definitely order again!',
    verified: false
  }
]

const similarProducts = [
  {
    id: 2,
    name: 'Green Apples',
    price: 4.49,
    originalPrice: 5.49,
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 892,
    organic: true,
    discount: 18
  },
  {
    id: 3,
    name: 'Organic Pears',
    price: 5.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 654,
    organic: true,
    discount: null
  },
  {
    id: 4,
    name: 'Fresh Oranges',
    price: 3.99,
    originalPrice: 4.99,
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 1123,
    organic: false,
    discount: 20
  },
  {
    id: 5,
    name: 'Organic Bananas',
    price: 2.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 2156,
    organic: true,
    discount: null
  }
]

const weights = [
  { value: 250, label: '250g', multiplier: 0.25 },
  { value: 500, label: '500g', multiplier: 0.5 },
  { value: 1000, label: '1kg', multiplier: 1 },
  { value: 2000, label: '2kg', multiplier: 2 }
]

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedWeight, setSelectedWeight] = useState(weights[2])
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { convertPrice } = useCurrency()
  const { addToCart } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(productData, selectedWeight)
    }
  }

  const currentPrice = productData.price * selectedWeight.multiplier
  const originalCurrentPrice = productData.originalPrice * selectedWeight.multiplier
  const totalPrice = currentPrice * quantity

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Product Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <img
                src={productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            
            <div className="flex gap-3">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-heading mb-3">{productData.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded text-white">
                  <Star size={16} className="fill-current" />
                  <span className="font-semibold">{productData.rating}</span>
                </div>
                <span className="text-gray-600">{productData.reviews.toLocaleString()} reviews</span>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded text-primary">
                  <Shield size={14} />
                  <span className="text-sm font-medium">FreshMart Assured</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-heading">{convertPrice(currentPrice)}</span>
                <span className="text-xl text-gray-400 line-through">{convertPrice(originalCurrentPrice)}</span>
                <span className="bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                  {productData.discount}% OFF
                </span>
              </div>
              <p className="text-gray-600">Price per {selectedWeight.label}</p>
            </div>

            {/* Weight Selection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-heading mb-3">Select Weight</h3>
              <div className="grid grid-cols-4 gap-3">
                {weights.map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => setSelectedWeight(weight)}
                    className={`p-3 rounded-xl border-2 transition-colors text-center ${
                      selectedWeight.value === weight.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{weight.label}</div>
                    <div className="text-sm text-gray-600">{convertPrice(productData.price * weight.multiplier)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold text-heading">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-gray-600">Total: {convertPrice(totalPrice)}</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="flex-1 bg-yellow text-white py-3 px-6 rounded-xl font-semibold hover:bg-yellow/90 transition-colors">
                  Buy Now
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-500'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-heading mb-3 flex items-center gap-2">
                <Truck size={20} />
                Delivery Information
              </h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Check
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span>Delivery by tomorrow 6 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  <span>Cash on delivery available</span>
                </div>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-heading mb-3 flex items-center gap-2">
                <Leaf size={20} className="text-primary" />
                Product Highlights
              </h3>
              <ul className="space-y-2">
                {productData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Storage:</strong> {productData.storage}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Harvest Date:</strong> {mounted ? new Date(productData.harvestDate).toLocaleDateString() : productData.harvestDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-heading mb-6">Customer Reviews</h2>
          
          <div className="space-y-6">
            {customerReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">{review.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-heading">{review.name}</h4>
                      {review.verified && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{mounted ? new Date(review.date).toLocaleDateString() : review.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                      ))}
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="btn-secondary">View All Reviews</button>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-heading mb-6">Similar Products</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {product.organic && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                      🌿 Organic
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded text-white text-xs">
                      <Star size={10} className="fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <h3 className="font-semibold text-heading text-sm">{product.name}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{convertPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{convertPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sticky Mobile Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-semibold"
          >
            Add to Cart
          </button>
          <button className="flex-1 bg-yellow text-white py-3 px-6 rounded-xl font-semibold">
            Buy Now
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}