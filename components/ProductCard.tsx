'use client'

import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCurrency } from './CurrencyContext'
import { useCart } from './CartContext'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number | null
  image: string
  rating: number
  reviews: number
  stock: number
  organic: boolean
  discount?: number | null
}

interface ProductCardProps {
  product: Product
  cart: {[key: number]: number}
  wishlist: number[]
  onAddToCart: (id: number) => void
  onRemoveFromCart: (id: number) => void
  onToggleWishlist: (id: number) => void
}

const weights = [
  { value: 250, label: '250g', multiplier: 0.25 },
  { value: 500, label: '500g', multiplier: 0.5 },
  { value: 1000, label: '1kg', multiplier: 1 }
]

export default function ProductCard({ 
  product, 
  cart, 
  wishlist, 
  onAddToCart, 
  onRemoveFromCart, 
  onToggleWishlist 
}: ProductCardProps) {
  const { convertPrice } = useCurrency()
  const { addToCart } = useCart()
  const [selectedWeight, setSelectedWeight] = useState(weights[2]) // Default 1kg
  const [isHovered, setIsHovered] = useState(false)
  
  const cartQuantity = cart[product.id] || 0
  const isWishlisted = wishlist.includes(product.id)
  const isOutOfStock = product.stock === 0
  
  const currentPrice = product.price * selectedWeight.multiplier
  const originalCurrentPrice = product.originalPrice ? product.originalPrice * selectedWeight.multiplier : null

  const handleAddToCart = () => {
    addToCart(product, selectedWeight)
    if (onAddToCart) onAddToCart(product.id)
  }

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative bg-gray-50 p-4">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-36 object-cover rounded-lg transition-transform duration-300 ${
              isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
          {product.organic && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
              🌿 Organic
            </span>
          )}
          {product.discount && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isHovered || isWishlisted ? 'opacity-100' : 'opacity-0'
          } ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white shadow-md text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-800">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded text-white text-xs">
            <Star size={10} className="fill-current" />
            <span className="font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-heading text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Weight Selection */}
        <div className="flex gap-1">
          {weights.map((weight) => (
            <button
              key={weight.value}
              onClick={() => setSelectedWeight(weight)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                selectedWeight.value === weight.value
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-gray-600 hover:border-primary'
              }`}
            >
              {weight.label}
            </button>
          ))}
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-heading">{convertPrice(currentPrice)}</span>
          {originalCurrentPrice && (
            <span className="text-sm text-gray-400 line-through">{convertPrice(originalCurrentPrice)}</span>
          )}
        </div>
        
        {/* Cart Controls */}
        {cartQuantity === 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-primary/10 rounded-lg p-2">
            <button 
              onClick={() => onRemoveFromCart(product.id)} 
              className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="font-semibold text-primary">{cartQuantity}</span>
            <button 
              onClick={() => onAddToCart(product.id)} 
              className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}