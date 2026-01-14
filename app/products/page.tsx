import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductsClient from '@/components/ProductsClient'

export const revalidate = 60;

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?limit=50`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ProductsClient initialProducts={products} />
      <Footer />
    </main>
  )
}
