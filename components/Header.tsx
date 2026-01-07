'use client'

import { ShoppingCart, Menu, X, Search, User, LogOut, Settings, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { getTotalItems } = useCart()
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    const email = localStorage.getItem('userEmail') || ''
    
    setIsLoggedIn(loggedIn)
    setIsAdmin(adminStatus)
    setUserEmail(email)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    setIsUserMenuOpen(false)
    setUserEmail('')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userEmail')
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            <span>🌿</span>
            <span>FreshMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 ${isAdmin ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                    {isAdmin ? (
                      <Shield size={16} className="text-blue-600" />
                    ) : (
                      <User size={16} className="text-green-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {isAdmin ? 'Admin' : userEmail.split('@')[0] || 'User'}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {isAdmin ? 'Administrator' : userEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'Admin Account' : 'Customer Account'}
                      </p>
                    </div>
                    
                    {isAdmin ? (
                      <>
                        <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Shield size={16} className="mr-3" />
                          Admin Dashboard
                        </Link>
                        <Link href="/admin/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                          <User size={16} className="mr-3" />
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                          <User size={16} className="mr-3" />
                          Profile
                        </Link>
                        <Link href="/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                          <ShoppingCart size={16} className="mr-3" />
                          Orders
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings size={16} className="mr-3" />
                          Settings
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2">
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </form>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Link 
                  href="/cart" 
                  className="relative p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group w-full flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 ${isAdmin ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mr-3`}>
                        {isAdmin ? (
                          <Shield size={16} className="text-blue-600" />
                        ) : (
                          <User size={16} className="text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isAdmin ? 'Administrator' : userEmail.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isAdmin ? 'Admin Account' : 'Customer Account'}
                        </p>
                      </div>
                    </div>
                    
                    {isAdmin ? (
                      <>
                        <Link href="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          Admin Dashboard
                        </Link>
                        <Link href="/admin/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          Profile
                        </Link>
                        <Link href="/orders" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          Orders
                        </Link>
                        <Link href="/settings" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          Settings
                        </Link>
                      </>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className="bg-gray-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full flex items-center justify-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}