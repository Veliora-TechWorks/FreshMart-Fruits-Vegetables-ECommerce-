import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CurrencyProvider } from '@/components/CurrencyContext'
import { CartProvider } from '@/components/CartContext'

export const metadata: Metadata = {
  title: 'FreshMart - Premium Organic Fruits & Vegetables',
  description: 'Farm-fresh organic fruits and vegetables delivered to your doorstep. Premium quality, sustainable farming, healthy living.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#80B500',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-body">
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}