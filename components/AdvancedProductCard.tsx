'use client'

import { useState, useEffect } from 'react'
import { Heart, ChevronDown, Plus, Minus, Zap, Star, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartContext'
import { Product, UnitOption } from '@/types/product'

interface AdvancedProductCardProps {
  product: Product
  variant?: 'compact' | 'standard' | 'horizontal'
  showActions?: boolean
  onQuickView?: (product: Product) => void
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void
}

export default function AdvancedProductCard({ 
  product, 
  variant = 'standard',
  showActions = true,
  onQuickView,
  onWishlistToggle
}: AdvancedProductCardProps) {
  const { addToCart, getCartQuantity, updateQuantity } = useCart()
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showUnits, setShowUnits] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const selectedUnit = product.unitOptions[selectedUnitIndex]
  const currentPrice = product.price * selectedUnit.multiplier
  const currentMrp = product.mrp * selectedUnit.multiplier
  const discountPercent = Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
  const hasDiscount = discountPercent > 0

  const cartQuantity = getCartQuantity(product.id)
  const isOutOfStock = !product.inStock || product.stockLevel === 'out'
  const isLowStock = product.stockLevel === 'low'

  const handleAddToCart = () => {
    if (cartQuantity === 0 && !isOutOfStock) {
      addToCart({ ...product, selectedUnit })
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      updateQuantity(product.id, 0)
    } else {
      if (cartQuantity === 0) {
        addToCart({ ...product, selectedUnit })
      } else {
        updateQuantity(product.id, newQuantity)
      }
    }
  }

  const handleUnitChange = (index: number) => {
    setSelectedUnitIndex(index)
    setShowUnits(false)
  }

  const handleWishlistToggle = () => {
    const newWishlistState = !isWishlisted
    setIsWishlisted(newWishlistState)
    onWishlistToggle?.(product.id, newWishlistState)
  }

  const getBadges = () => {
    const badges = []
    if (product.isOrganic) badges.push({ text: 'Organic', color: 'bg-green-600' })
    if (product.isFresh) badges.push({ text: 'Fresh', color: 'bg-blue-600' })
    if (product.isBestSeller) badges.push({ text: 'Best Seller', color: 'bg-orange-600' })
    if (product.isSeasonal) badges.push({ text: 'Seasonal', color: 'bg-purple-600' })
    return badges
  }

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-600' }
    if (isLowStock) return { text: 'Low Stock', color: 'text-orange-600' }
    return null
  }

  const cardClasses = {
    compact: 'w-full max-w-[180px]',
    standard: 'w-full max-w-[220px]',
    horizontal: 'w-full max-w-[400px] flex-row'
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group ${cardClasses[variant]} ${variant === 'horizontal' ? 'flex' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 ${variant === 'horizontal' ? 'w-40 flex-shrink-0' : 'aspect-square'} p-4`}>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercent}% OFF
            </div>
          )}
          {getBadges().slice(0, 2).map((badge, index) => (
            <div key={index} className={`${badge.color} text-white text-xs font-medium px-2 py-1 rounded-full`}>
              {badge.text}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleWishlistToggle}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center p-2">
          {!imageError && product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Freshness Indicator */}
        {product.freshnessScore && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            {product.freshnessScore}% Fresh
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-4 space-y-3 ${variant === 'horizontal' ? 'flex-1' : ''}`}>
        {/* Category */}
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {product.category}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className={`font-bold text-gray-900 line-clamp-2 leading-tight hover:text-green-600 transition-colors cursor-pointer ${variant === 'compact' ? 'text-sm' : 'text-base'}`}>
            {product.name}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
          </div>
        )}

        {/* Unit Selector */}
        <div className="relative">
          <button
            onClick={() => setShowUnits(!showUnits)}
            className="w-full flex items-center justify-between text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:border-green-300 transition-colors bg-gray-50"
          >
            <span className="font-medium">{selectedUnit.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showUnits ? 'rotate-180' : ''}`} />
          </button>
          
          {showUnits && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-40 overflow-y-auto">
              {product.unitOptions.map((unit, index) => (
                <button
                  key={index}
                  onClick={() => handleUnitChange(index)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    index === selectedUnitIndex ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{unit.label}</span>
                    <span className="text-xs text-gray-500">₹{(product.price * unit.multiplier).toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className={`font-bold text-gray-900 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
            ₹{currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{currentMrp.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {getStockStatus() && (
          <div className={`text-sm font-medium ${getStockStatus()?.color}`}>
            {getStockStatus()?.text}
          </div>
        )}

        {/* Action Section */}
        {showActions && (
          <div className="space-y-2 pt-2">
            {cartQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'border border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <div className="flex items-center justify-between bg-green-600 text-white rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(cartQuantity - 1)}
                  className="p-3 hover:bg-green-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold px-4 min-w-[60px] text-center">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(cartQuantity + 1)}
                  className="p-3 hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommended Badge */}
        {product.isRecommended && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full text-center">
            ⭐ Recommended
          </div>
        )}
      </div>
    </div>
  )
}