'use client'

import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, NY',
    rating: 5,
    comment: 'The freshest produce I\'ve ever received! The delivery was quick and everything was perfectly packaged. My family loves the organic vegetables.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Los Angeles, CA',
    rating: 5,
    comment: 'FreshMart has transformed our weekly grocery shopping. The quality is outstanding and the convenience is unmatched. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Chicago, IL',
    rating: 5,
    comment: 'Amazing service! The fruits are always ripe and delicious. I love supporting local farms through FreshMart. Will definitely continue ordering.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
]

export default function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0)

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const review = reviews[currentReview]

  return (
    <section className="section-padding bg-accent/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
            What Our Customers Say
          </h2>
          <p className="text-body text-lg">
            Join thousands of satisfied customers who trust FreshMart for their daily produce needs
          </p>
        </div>

        <div className="relative">
          <div className="card p-8 md:p-12 max-w-3xl mx-auto">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow fill-current" />
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="text-lg md:text-xl text-body italic mb-8 leading-relaxed">
              "{review.comment}"
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-center space-x-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-heading">{review.name}</div>
                <div className="text-body">{review.location}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentReview ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}