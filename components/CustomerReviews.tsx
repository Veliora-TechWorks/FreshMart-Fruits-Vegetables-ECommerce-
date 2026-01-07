'use client'

import { Star } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    comment: 'Excellent quality vegetables! Fresh delivery every time. My family is very happy with FreshMart service.'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    rating: 5,
    comment: 'Best organic fruits in the city. Quick delivery and reasonable prices. Highly recommend to everyone.'
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 4,
    comment: 'Very good service and fresh produce. The vegetables stay fresh for many days. Great experience overall.'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Bangalore, Karnataka',
    rating: 5,
    comment: 'Amazing quality and packaging. The fruits are always sweet and fresh. Will definitely order again.'
  },
  {
    id: 5,
    name: 'Meera Reddy',
    location: 'Hyderabad, Telangana',
    rating: 4,
    comment: 'Good variety of organic products. Delivery is always on time. Happy with the overall service quality.'
  },
  {
    id: 6,
    name: 'Arjun Nair',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    comment: 'Superb quality vegetables at fair prices. Customer service is excellent. Highly satisfied customer here.'
  }
]

export default function CustomerReviews() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-heading mb-2 sm:mb-3 md:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-body">
            Trusted by thousands of families across India
          </p>
        </div>

        {/* Mobile: Single column */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:hidden">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex mb-2 sm:mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={12} className="xs:size-[14px] text-yellow fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">
                "{review.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 xs:w-8 xs:h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-heading text-xs sm:text-sm">{review.name}</div>
                  <div className="text-gray-500 text-xs">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 sm:gap-6">
          {reviews.slice(0, 4).map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex mb-3 sm:mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="sm:size-4 text-yellow fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm leading-relaxed">
                "{review.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-heading text-sm">{review.name}</div>
                  <div className="text-gray-500 text-xs">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{review.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-heading text-sm">{review.name}</div>
                  <div className="text-gray-500 text-xs">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}