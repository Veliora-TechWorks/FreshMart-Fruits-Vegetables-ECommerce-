import Header from '@/components/Header'
import CategorySlider from '@/components/CategorySlider'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import HowItWorks from '@/components/HowItWorks'
import About from '@/components/About'
import CustomerReviews from '@/components/CustomerReviews'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <CategorySlider />
      <Hero />
      <FeaturedProducts />
      <HowItWorks />
      <About />
      <CustomerReviews />
      <Footer />
    </main>
  )
}