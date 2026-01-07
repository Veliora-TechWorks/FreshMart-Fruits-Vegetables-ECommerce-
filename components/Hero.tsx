import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section id="home" className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 bg-gradient-to-br from-accent to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-block">
              <span className="bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                🌱 Organic
              </span>
            </div>
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-heading leading-tight px-2 sm:px-0">
              Healthy & Fresh Food for Your Family
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-body leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
              Farm-fresh organic fruits and vegetables delivered straight to your doorstep. 
              <span className="hidden sm:inline">Experience the taste of nature with our premium quality produce.</span>
            </p>
            
            <div className="flex flex-col xs:flex-row gap-3 pt-2 justify-center lg:justify-start px-2 sm:px-0">
              <Link href="/products" className="btn-primary flex items-center justify-center space-x-2 group min-h-[44px]">
                <span>Shop Now</span>
                <ArrowRight size={16} className="sm:size-[18px] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-secondary min-h-[44px] flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2 px-4 sm:px-0">
            <div className="bg-yellow/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 transform rotate-1 md:rotate-2">
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 md:p-3 transform -rotate-1 md:-rotate-2 shadow-lg sm:shadow-xl md:shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Fresh fruits and vegetables"
                  className="w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-md sm:rounded-lg md:rounded-xl"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 md:-top-3 md:-left-3 bg-primary text-white p-1.5 sm:p-2 rounded-full shadow-lg text-xs sm:text-sm">
              🥕
            </div>
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 md:-bottom-3 md:-right-3 bg-yellow text-white p-1.5 sm:p-2 rounded-full shadow-lg text-xs sm:text-sm">
              🍎
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}