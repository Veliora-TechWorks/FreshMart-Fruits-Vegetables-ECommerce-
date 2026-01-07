'use client'

import Link from 'next/link'

const categories = [
  { id: 1, name: 'Fresh Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 2, name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 3, name: 'Leafy Greens', slug: 'leafy-greens', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 4, name: 'Berries', slug: 'berries', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 5, name: 'Citrus Fruits', slug: 'citrus', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 6, name: 'Tropical Fruits', slug: 'tropical', image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 7, name: 'Fresh Herbs', slug: 'herbs', image: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 8, name: 'Organic Mix', slug: 'organic', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
]

export default function CategorySlider() {
  return (
    <section className="py-6 md:py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-heading mb-4 md:mb-6 text-center md:text-left">Shop by Category</h2>
        
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <div className="flex flex-col items-center cursor-pointer group flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 group-hover:scale-110 transition-transform duration-200 shadow-lg border-2 border-white">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-medium text-center text-heading group-hover:text-primary transition-colors leading-tight w-16">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Tablet & Desktop: Grid */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg border-2 border-white">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm lg:text-base font-medium text-center text-heading group-hover:text-primary transition-colors leading-tight">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}