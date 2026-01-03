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
    <section className="section-padding bg-accent/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Right - Process Steps */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
                How It Works
              </h2>
              <p className="text-body text-lg">
                Simple steps to get fresh, organic produce delivered to your home
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-heading mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body">
                      {step.description}
                    </p>
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