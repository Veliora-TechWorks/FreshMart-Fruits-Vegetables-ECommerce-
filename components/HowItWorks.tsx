import { ShoppingBag, CreditCard, CheckCircle, Truck } from 'lucide-react'

const steps = [
  {
    icon: ShoppingBag,
    title: 'Choose Fresh Produce',
    description: 'Browse our wide selection of organic fruits and vegetables',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    icon: CreditCard,
    title: 'Secure Online Payment',
    description: 'Safe and secure checkout with multiple payment options',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    icon: CheckCircle,
    title: 'Order Confirmation',
    description: 'Receive instant confirmation and track your order',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    icon: Truck,
    title: 'Fast Home Delivery',
    description: 'Fresh produce delivered to your doorstep within 24 hours',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Mobile & Tablet: Content First */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-heading mb-2 sm:mb-3 md:mb-4">
                How It Works
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-body">
                Simple steps to get fresh, organic produce delivered to your home
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 md:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm md:text-base">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg md:text-xl font-semibold text-heading mb-1 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-body">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="order-2 lg:order-1">
            {/* Mobile: Single column */}
            <div className="grid grid-cols-2 gap-2 xs:gap-3 md:gap-4 lg:hidden">
              {steps.slice(0, 4).map((step, index) => (
                <div key={index} className="relative group">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-28 xs:h-32 sm:h-36 md:h-40 object-cover rounded-lg xs:rounded-xl md:rounded-2xl shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-lg xs:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 xs:top-3 md:top-4 left-2 xs:left-3 md:left-4 bg-white p-1 xs:p-1.5 md:p-2 rounded-full shadow-lg">
                    <step.icon size={12} className="xs:size-4 md:size-5 text-primary" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop: 2x2 Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-40 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg">
                    <step.icon size={20} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}