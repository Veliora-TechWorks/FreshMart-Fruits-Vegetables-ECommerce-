'use client'

import { useState } from 'react'
import { Package, Truck, CheckCircle, XCircle, Eye, Download, Filter, Search, Star, RefreshCw, MessageCircle } from 'lucide-react'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 450,
      items: [
        { name: '🍌 Fresh Bananas', quantity: 2, price: 120, image: '/api/placeholder/60/60' },
        { name: '🍎 Organic Apples', quantity: 1, price: 180, image: '/api/placeholder/60/60' },
        { name: '🥬 Green Spinach', quantity: 1, price: 150, image: '/api/placeholder/60/60' }
      ],
      deliveryAddress: '123 Green Street, Mumbai',
      trackingId: 'TRK123456789',
      rating: 5,
      estimatedDelivery: '2024-01-16'
    },
    {
      id: 'ORD-002',
      date: '2024-01-12',
      status: 'shipped',
      total: 320,
      items: [
        { name: '🍅 Red Tomatoes', quantity: 2, price: 160, image: '/api/placeholder/60/60' },
        { name: '🥕 Fresh Carrots', quantity: 1, price: 160, image: '/api/placeholder/60/60' }
      ],
      deliveryAddress: '123 Green Street, Mumbai',
      trackingId: 'TRK987654321',
      estimatedDelivery: '2024-01-14'
    },
    {
      id: 'ORD-003',
      date: '2024-01-08',
      status: 'processing',
      total: 680,
      items: [
        { name: '🥗 Mixed Vegetables Bundle', quantity: 1, price: 680, image: '/api/placeholder/60/60' }
      ],
      deliveryAddress: '123 Green Street, Mumbai',
      trackingId: 'TRK456789123',
      estimatedDelivery: '2024-01-10'
    }
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered': return { 
        icon: <CheckCircle className="w-5 h-5" />, 
        color: 'text-green-600', 
        bg: 'bg-green-50 border-green-200', 
        badge: 'bg-green-100 text-green-800' 
      }
      case 'shipped': return { 
        icon: <Truck className="w-5 h-5" />, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50 border-blue-200', 
        badge: 'bg-blue-100 text-blue-800' 
      }
      case 'processing': return { 
        icon: <RefreshCw className="w-5 h-5 animate-spin" />, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50 border-yellow-200', 
        badge: 'bg-yellow-100 text-yellow-800' 
      }
      default: return { 
        icon: <XCircle className="w-5 h-5" />, 
        color: 'text-red-600', 
        bg: 'bg-red-50 border-red-200', 
        badge: 'bg-red-100 text-red-800' 
      }
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">🌿 My Fresh Orders</h1>
            <p className="text-xl text-green-100">Track your organic journey with us</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'shipped').length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'processing').length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your fresh orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white"
            >
              <option value="all">🌟 All Orders</option>
              <option value="processing">⏳ Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">✅ Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6 pb-8">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            return (
              <div key={order.id} className={`bg-white rounded-2xl shadow-lg border-2 ${statusConfig.bg} overflow-hidden hover:shadow-xl transition-all duration-300`}>
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className={`p-3 rounded-full bg-white shadow-md ${statusConfig.color}`}>
                        {statusConfig.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                        <p className="text-gray-600">📅 {new Date(order.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        {order.estimatedDelivery && order.status !== 'delivered' && (
                          <p className="text-sm text-green-600 font-medium">🚚 Expected: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-2 text-sm font-bold rounded-full ${statusConfig.badge}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      🛒 Fresh Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 flex items-center space-x-3 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-green-600">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details & Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="font-medium text-gray-700">Delivery Address</p>
                          <p className="text-gray-600">{order.deliveryAddress}</p>
                        </div>
                      </div>
                      {order.trackingId && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🔍</span>
                          <div>
                            <p className="font-medium text-gray-700">Tracking ID</p>
                            <p className="text-gray-600 font-mono">{order.trackingId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {order.status === 'shipped' || order.status === 'delivered' ? (
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Order
                        </button>
                      ) : null}
                      <button className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </button>
                      {order.status === 'delivered' && (
                        <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                          <Star className="w-4 h-4 mr-2" />
                          Rate Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rating Display for Delivered Orders */}
                  {order.status === 'delivered' && order.rating && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-800">Your Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-green-600">Thank you for your feedback! 🌟</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔍 No Orders Found</h3>
              <p className="text-gray-600 mb-6">Looks like you haven't placed any orders yet or they don't match your search.</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                🛒 Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}