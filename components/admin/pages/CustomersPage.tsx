'use client'

import { useState, useRef } from 'react'
import { Search, Filter, Eye, Edit, Mail, Phone, MapPin, Calendar, ShoppingBag, Users, X, Plus, Trash2, Upload } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
  loyaltyPoints: number
  avatar?: string
  notes?: string
}

export default function CustomersPage() {
  const { formatPrice } = useIndianCurrency()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 9876543210',
      address: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      joinDate: '2023-06-15',
      totalOrders: 24,
      totalSpent: 12450,
      lastOrder: '2024-01-14',
      status: 'active',
      loyaltyPoints: 245,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      notes: 'Prefers organic products'
    },
    {
      id: 'CUST-002',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 9876543211',
      address: '456 Park Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      joinDate: '2023-08-22',
      totalOrders: 18,
      totalSpent: 8900,
      lastOrder: '2024-01-15',
      status: 'active',
      loyaltyPoints: 178,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      notes: 'Regular customer, likes discounts'
    },
    {
      id: 'CUST-003',
      name: 'Amit Patel',
      email: 'amit@email.com',
      phone: '+91 9876543212',
      address: '789 Ring Road',
      city: 'Delhi',
      state: 'Delhi',
      joinDate: '2023-04-10',
      totalOrders: 32,
      totalSpent: 18750,
      lastOrder: '2024-01-13',
      status: 'active',
      loyaltyPoints: 375,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      notes: 'VIP customer, bulk orders'
    },
    {
      id: 'CUST-004',
      name: 'Sneha Reddy',
      email: 'sneha@email.com',
      phone: '+91 9876543213',
      address: '321 Beach Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      joinDate: '2023-09-05',
      totalOrders: 12,
      totalSpent: 5600,
      lastOrder: '2023-12-20',
      status: 'inactive',
      loyaltyPoints: 112,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      notes: 'Inactive for 3 months'
    }
  ])

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 15000) return { tier: 'Gold', color: 'text-yellow-600' }
    if (totalSpent >= 8000) return { tier: 'Silver', color: 'text-gray-600' }
    return { tier: 'Bronze', color: 'text-orange-600' }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
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

  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`
    }
    setCustomers(prev => [...prev, newCustomer])
    setShowAddModal(false)
  }

  const updateCustomer = (id: string, customerData: Omit<Customer, 'id'>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...customerData, id } : c))
    setSelectedCustomer(null)
    setShowAddModal(false)
  }

  const deleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDetailsModal(true)
    setShowAddModal(false)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowAddModal(true)
    setShowDetailsModal(false)
  }

  const CustomerForm = ({ customer, onClose }: { customer?: Customer | null, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      joinDate: customer?.joinDate || new Date().toISOString().split('T')[0],
      totalOrders: customer?.totalOrders || 0,
      totalSpent: customer?.totalSpent || 0,
      lastOrder: customer?.lastOrder || new Date().toISOString().split('T')[0],
      status: customer?.status || 'active' as Customer['status'],
      loyaltyPoints: customer?.loyaltyPoints || 0,
      avatar: customer?.avatar || '',
      notes: customer?.notes || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (customer) {
        updateCustomer(customer.id, formData)
      } else {
        addCustomer(formData)
      }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleImageUpload(file, (url) => {
          setFormData(prev => ({ ...prev, avatar: url }))
        })
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {customer ? 'Edit Customer' : 'Add New Customer'}
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
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Orders</label>
                  <input
                    type="number"
                    value={formData.totalOrders}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalOrders: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent (₹)</label>
                  <input
                    type="number"
                    value={formData.totalSpent}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalSpent: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Points</label>
                  <input
                    type="number"
                    value={formData.loyaltyPoints}
                    onChange={(e) => setFormData(prev => ({ ...prev, loyaltyPoints: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Customer['status'] }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Order</label>
                  <input
                    type="date"
                    value={formData.lastOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastOrder: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Customer notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Avatar</label>
                {formData.avatar && (
                  <div className="mb-2">
                    <img src={formData.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full" />
                  </div>
                )}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {uploading ? 'Uploading...' : 'Click to upload avatar'}
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
                  {uploading ? 'Uploading...' : customer ? 'Update Customer' : 'Add Customer'}
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

  const CustomerDetailsModal = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
    const tier = getCustomerTier(customer.totalSpent)
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  {customer.avatar ? (
                    <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-green-600 font-bold text-xl">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{customer.name}</h4>
                  <p className="text-gray-500">{customer.id}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      {customer.address}, {customer.city}, {customer.state}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3">Account Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Join Date:</span>
                      <span>{new Date(customer.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span>{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span className="font-medium">{formatPrice(customer.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loyalty Points:</span>
                      <span className="text-green-600 font-medium">{customer.loyaltyPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Tier:</span>
                      <span className={`font-medium ${tier.color}`}>
                        {tier.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div>
                  <h5 className="font-medium mb-2">Notes</h5>
                  <p className="text-gray-600 text-sm">{customer.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button 
                  onClick={() => handleEditCustomer(customer)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Customer
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Send Email
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Add Loyalty Points
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
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage and view customer information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0))}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent)
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-green-600 font-medium text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.city}</div>
                      <div className="text-sm text-gray-500">{customer.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${tier.color}`}>
                        {tier.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-green-600 hover:text-green-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <CustomerForm 
          customer={selectedCustomer} 
          onClose={() => {
            setSelectedCustomer(null)
            setShowAddModal(false)
          }}
        />
      )}

      {showDetailsModal && selectedCustomer && (
        <CustomerDetailsModal 
          customer={selectedCustomer} 
          onClose={() => {
            setSelectedCustomer(null)
            setShowDetailsModal(false)
          }}
        />
      )}
    </div>
  )
}