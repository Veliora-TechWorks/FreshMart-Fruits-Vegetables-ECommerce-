'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, ShoppingCart, Package, Warehouse, Tag, Users, 
  MessageSquare, Brain, BarChart3, Settings, Menu, X, Bell, Search, LogOut, Home 
} from 'lucide-react'
import { useAdmin } from './AdminContext'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Orders', icon: ShoppingCart },
  { name: 'Products', icon: Package },
  { name: 'Inventory', icon: Warehouse },
  { name: 'Pricing & Offers', icon: Tag },
  { name: 'Customers', icon: Users },
  { name: 'Reviews', icon: MessageSquare },
  { name: 'AI Insights', icon: Brain },
  { name: 'Reports', icon: BarChart3 },
  { name: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useAdmin()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear all session data
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('userEmail')
      // Redirect to home page
      window.location.href = '/'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            {sidebarOpen && <span className="ml-3 font-bold text-gray-800">FreshMart Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setCurrentView(item.name)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      currentView === item.name
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">{currentView}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go to Main Site"
              >
                <Home size={18} className="mr-2" />
                <span className="text-sm">Home</span>
              </Link>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-white text-sm font-medium">A</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@freshmart.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}