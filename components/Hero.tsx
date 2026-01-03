import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section id="home" className="py-12 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <div className="inline-block">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🌱 Organic
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight">
              Healthy & Fresh Food for Your Family
            </h1>
            
            <p className="text-base text-body leading-relaxed max-w-lg">
              Farm-fresh organic fruits and vegetables delivered straight to your doorstep. 
              Experience the taste of nature with our premium quality produce.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/products" className="btn-primary flex items-center justify-center space-x-2 group">
                <span>Shop Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-yellow/20 rounded-3xl p-6 transform rotate-2">
              <div className="bg-white rounded-2xl p-3 transform -rotate-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Fresh fruits and vegetables"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-3 -left-3 bg-primary text-white p-2 rounded-full shadow-lg text-sm">
              🥕
            </div>
            <div className="absolute -bottom-3 -right-3 bg-yellow text-white p-2 rounded-full shadow-lg text-sm">
              🍎
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}