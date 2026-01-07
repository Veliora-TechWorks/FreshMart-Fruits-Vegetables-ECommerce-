import { Leaf, Heart, Award } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-3 md:mb-4">
                About FreshMart
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-body leading-relaxed">
                At FreshMart, we believe that everyone deserves access to fresh, organic, and nutritious produce. 
                <span className="hidden md:inline">
                  Our journey began with a simple mission: to connect families with the finest fruits and vegetables 
                  directly from local farms to your table.
                </span>
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Leaf size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading text-sm md:text-base">100% Organic</h4>
                  <p className="text-body text-xs md:text-sm">Certified organic produce from trusted local farms</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading text-sm md:text-base">Farm to Home</h4>
                  <p className="text-body text-xs md:text-sm">Direct from farm to your doorstep within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading text-sm md:text-base">Premium Quality</h4>
                  <p className="text-body text-xs md:text-sm">Hand-picked and quality-checked for freshness</p>
                </div>
              </div>
            </div>

            <div className="pt-2 md:pt-4 text-center lg:text-left">
              <Link href="/about" className="btn-secondary">
                Learn More About Us
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-accent rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Fresh organic produce"
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Stats overlay - Hidden on mobile */}
            <div className="hidden md:block absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-primary">5000+</div>
                <div className="text-xs lg:text-sm text-body">Happy Customers</div>
              </div>
            </div>
            
            <div className="hidden md:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-primary">100%</div>
                <div className="text-xs lg:text-sm text-body">Organic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}