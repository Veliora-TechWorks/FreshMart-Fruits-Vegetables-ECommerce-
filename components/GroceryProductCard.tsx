'use client'

import { useState } from 'react'
import { Heart, ChevronDown, Plus, Minus, Zap } from 'lucide-react'
import Image from 'next/image'

interface ProductVariant {
  label: string
  price: number
}

interface Product {
  id: string
  brand: string
  name: string
  image: string
  variants: ProductVariant[]
  mrp: number
  deliveryTime: string
  offerText: string
  inStock: boolean
}

interface GroceryProductCardProps {
  product: Product
  onAddToCart?: (productId: string, variant: ProductVariant, quantity: number) => void
  onWishlistToggle?: (productId: string) => void
}

export default function GroceryProductCard({ 
  product, 
  onAddToCart, 
  onWishlistToggle 
}: GroceryProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showVariants, setShowVariants] = useState(false)

  const selectedVariant = product.variants[selectedVariantIndex]
  const discountPercent = Math.round(((product.mrp - selectedVariant.price) / product.mrp) * 100)
  const hasDiscount = discountPercent > 0

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1)
      onAddToCart?.(product.id, selectedVariant, 1)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta)
    setQuantity(newQuantity)
    
    if (newQuantity > 0) {
      onAddToCart?.(product.id, selectedVariant, newQuantity)
    }
  }

  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index)
    setQuantity(0) // Reset quantity when variant changes
    setShowVariants(false)
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    onWishlistToggle?.(product.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 w-full max-w-[200px] group">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-50 p-4">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            {discountPercent}% OFF
          </div>
        )}
        
        {/* Delivery Badge */}
        <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1 z-10">
          <Zap className="w-3 h-3 fill-current" />
          {product.deliveryTime}
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={120}
              height={120}
              className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Brand */}
        <div className="text-xs text-gray-500 font-medium">
          {product.brand}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Variant Selector */}
        <div className="relative">
          <button
            onClick={() => setShowVariants(!showVariants)}
            className="w-full flex items-center justify-between text-xs text-gray-700 border border-gray-200 rounded px-2 py-1.5 hover:border-gray-300 transition-colors"
          >
            <span className="truncate">{selectedVariant.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showVariants ? 'rotate-180' : ''}`} />
          </button>
          
          {showVariants && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg z-20 mt-1">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => handleVariantChange(index)}
                  className={`w-full text-left px-2 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                    index === selectedVariantIndex ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            ₹{selectedVariant.price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Offer Strip */}
        <div className="bg-green-50 border border-green-200 rounded px-2 py-1 flex items-center justify-between">
          <span className="text-xs text-green-700 font-medium">
            {product.offerText}
          </span>
          <ChevronDown className="w-3 h-3 text-green-600" />
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>

          {/* Add to Cart / Quantity Controls */}
          <div className="flex-1 ml-2">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-1.5 px-3 text-xs font-semibold rounded border transition-all ${
                  product.inStock
                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white active:scale-95'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'ADD' : 'Out of Stock'}
              </button>
            ) : (
              <div className="flex items-center justify-between bg-red-500 text-white rounded overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-1.5 hover:bg-red-600 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-semibold px-2 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-1.5 hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}