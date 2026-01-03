import { Leaf, Heart, Award } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
                About FreshMart
              </h2>
              <p className="text-body text-lg leading-relaxed">
                At FreshMart, we believe that everyone deserves access to fresh, organic, and nutritious produce. 
                Our journey began with a simple mission: to connect families with the finest fruits and vegetables 
                directly from local farms to your table.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Leaf size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading">100% Organic</h4>
                  <p className="text-body">Certified organic produce from trusted local farms</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading">Farm to Home</h4>
                  <p className="text-body">Direct from farm to your doorstep within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-heading">Premium Quality</h4>
                  <p className="text-body">Hand-picked and quality-checked for freshness</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about" className="btn-secondary">
                Learn More About Us
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="bg-accent rounded-3xl p-8">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Fresh organic produce"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-body">Happy Customers</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-body">Organic</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}