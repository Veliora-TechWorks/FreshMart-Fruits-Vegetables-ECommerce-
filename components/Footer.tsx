import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-heading text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        
        {/* Mobile: Single column */}
        <div className="md:hidden space-y-4 sm:space-y-6">
          {/* Brand */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-primary">🌿 FreshMart</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for fresh, organic fruits and vegetables.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={16} className="sm:size-[18px]" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={16} className="sm:size-[18px]" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={16} className="sm:size-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick Links & Categories */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#home" className="text-gray-300 hover:text-primary transition-colors">Home</a></li>
                <li><a href="#products" className="text-gray-300 hover:text-primary transition-colors">Products</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Categories</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Fruits</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Vegetables</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Organic</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Seasonal</a></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Contact Us</h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Phone size={12} className="sm:size-[14px] text-primary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail size={12} className="sm:size-[14px] text-primary" />
                <span className="text-gray-300">hello@freshmart.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop: Multi-column */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl lg:text-2xl font-bold text-primary">🌿 FreshMart</h3>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
              Your trusted partner for fresh, organic fruits and vegetables. 
              <span className="hidden lg:inline">
                Farm-to-home delivery with a commitment to quality and sustainability.
              </span>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-primary transition-colors">Products</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Fresh Fruits</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Vegetables</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Organic Produce</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Seasonal Items</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <span className="text-gray-300">hello@freshmart.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-gray-300">123 Fresh Street, Green City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 text-center">
          <p className="text-gray-300 text-xs sm:text-sm">
            © 2024 FreshMart. All rights reserved. Made with 💚 for healthy living.
          </p>
        </div>
      </div>
    </footer>
  )
}