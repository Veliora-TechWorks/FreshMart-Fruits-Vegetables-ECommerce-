import AdvancedProductCard from './AdvancedProductCard'
import { Product, CardVariant } from '@/types/product'

interface ProductCardProps {
  product: Product
  variant?: CardVariant
  onAddToCart?: (product: Product, quantity: number) => void
  onWishlistToggle?: (productId: string) => void
  isWishlisted?: boolean
  showActions?: boolean
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ 
  product, 
  variant = 'standard',
  onAddToCart, 
  onWishlistToggle,
  isWishlisted = false,
  showActions = true,
  onQuickView
}: ProductCardProps) {
  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    onWishlistToggle?.(productId)
  }

  // Map variant to supported AdvancedProductCard variants
  const getVariant = (): 'compact' | 'standard' | 'horizontal' => {
    if (variant === 'horizontal') return 'horizontal'
    if (variant === 'compact') return 'compact'
    return 'standard' // default for 'standard', 'minimal', 'admin'
  }

  return (
    <AdvancedProductCard
      product={product}
      variant={getVariant()}
      showActions={showActions}
      onQuickView={onQuickView}
      onWishlistToggle={handleWishlistToggle}
    />
  )
}