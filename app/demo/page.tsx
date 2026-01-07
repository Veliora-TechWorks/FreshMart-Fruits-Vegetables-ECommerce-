import { CartProvider } from '@/components/CartContext'
import AdvancedProductCardDemo from '@/components/AdvancedProductCardDemo'

export default function ProductCardDemoPage() {
  return (
    <CartProvider>
      <AdvancedProductCardDemo />
    </CartProvider>
  )
}