'use client'

import { useState, useRef } from 'react'
import { Search, Filter, Eye, Edit, Truck, CheckCircle, Clock, X, Plus, Trash2, Upload } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface Order {
  id: string
  customer: string
  email: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  address: string
  phone?: string
  notes?: string
  trackingId?: string
  image?: string
}

export default function OrdersPage() {
  const { formatPrice } = useIndianCurrency()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      items: 5,
      total: 850,
      status: 'pending',
      date: '2024-01-15',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 9876543210',
      notes: 'Please deliver in the evening'
    },
    {
      id: 'ORD-002',
      customer: 'Priya Sharma',
      email: 'priya@email.com',
      items: 3,
      total: 450,
      status: 'processing',
      date: '2024-01-15',
      address: '456 Park Street, Mumbai, Maharashtra 400001',
      phone: '+91 9876543211',
      trackingId: 'TRK123456'
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      email: 'amit@email.com',
      items: 8,
      total: 1200,
      status: 'shipped',
      date: '2024-01-14',
      address: '789 Ring Road, Delhi, Delhi 110001',
      phone: '+91 9876543212',
      trackingId: 'TRK789012'
    },
    {
      id: 'ORD-004',
      customer: 'Sneha Reddy',
      email: 'sneha@email.com',
      items: 2,
      total: 320,
      status: 'delivered',
      date: '2024-01-14',
      address: '321 Beach Road, Chennai, Tamil Nadu 600001',
      phone: '+91 9876543213'
    }
  ])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Edit className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'FreshMart')
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/dh7asuhkg/image/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    return data.secure_url
  }

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      callback(imageUrl)
    } catch (error) {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`
    }
    setOrders(prev => [...prev, newOrder])
    setShowAddModal(false)
  }

  const updateOrder = (id: string, orderData: Omit<Order, 'id'>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...orderData, id } : o))
    setSelectedOrder(null)
    setShowAddModal(false)
  }

  const deleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(o => o.id !== id))
    }
  }

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
    setShowAddModal(false)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowAddModal(true)
    setShowDetailsModal(false)
  }

  const OrderForm = ({ order, onClose }: { order?: Order | null, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      customer: order?.customer || '',
      email: order?.email || '',
      phone: order?.phone || '',
      items: order?.items || 1,
      total: order?.total || 0,
      status: order?.status || 'pending' as Order['status'],
      date: order?.date || new Date().toISOString().split('T')[0],
      address: order?.address || '',
      notes: order?.notes || '',
      trackingId: order?.trackingId || '',
      image: order?.image || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (order) {
        updateOrder(order.id, formData)
      } else {
        addOrder(formData)
      }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleImageUpload(file, (url) => {
          setFormData(prev => ({ ...prev, image: url }))
        })
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {order ? 'Edit Order' : 'Add New Order'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items Count</label>
                  <input
                    type="number"
                    value={formData.items}
                    onChange={(e) => setFormData(prev => ({ ...prev, items: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, total: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Order['status'] }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    onChange={(e) => setFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Image/Receipt</label>
                {formData.image && (
                  <div className="mb-2">
                    <img src={formData.image} alt="Order" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : order ? 'Update Order' : 'Add Order'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const OrderDetailsModal = ({ order, onClose }: { order: Order, onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details - {order.id}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {order.customer}</p>
                <p><strong>Email:</strong> {order.email}</p>
                {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
                <p><strong>Address:</strong> {order.address}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Order Information</h4>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Items:</strong> {order.items}</p>
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                {order.trackingId && <p><strong>Tracking ID:</strong> {order.trackingId}</p>}
                {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                <p><strong>Status:</strong> 
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </p>
              </div>

              {order.image && (
                <div>
                  <h4 className="font-medium mb-2">Order Image</h4>
                  <img src={order.image} alt="Order" className="w-32 h-32 object-cover rounded" />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button 
                  onClick={() => handleEditOrder(order)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Order
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-green-600 hover:text-green-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <OrderForm 
          order={selectedOrder} 
          onClose={() => {
            setSelectedOrder(null)
            setShowAddModal(false)
          }}
        />
      )}

      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => {
            setSelectedOrder(null)
            setShowDetailsModal(false)
          }}
        />
      )}
    </div>
  )
}