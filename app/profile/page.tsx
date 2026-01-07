'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Camera, Package, Heart, CreditCard } from 'lucide-react'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    avatar: '',
    address: '123 Green Street, Organic City, Mumbai, Maharashtra 400001',
    dateOfBirth: '1990-05-15',
    joinedDate: '2023-12-01',
    totalOrders: 24,
    totalSpent: 12450,
    loyaltyPoints: 1245
  })

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'FreshMart')
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dh7asuhkg/image/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      setUserData(prev => ({ ...prev, avatar: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSave = () => {
    setEditing(false)
    // Save user data logic here
    alert('Profile updated successfully!')
  }

  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', items: 'Fresh Bananas, Organic Apples', total: 450, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-12', items: 'Green Spinach, Red Tomatoes', total: 320, status: 'Delivered' },
    { id: 'ORD-003', date: '2024-01-08', items: 'Mixed Vegetables Bundle', total: 680, status: 'In Transit' }
  ]

  const wishlistItems = [
    { id: 1, name: 'Organic Strawberries', price: 299, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Fresh Avocados', price: 199, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Dragon Fruit', price: 399, image: '/api/placeholder/80/80' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-green-600" />
                </div>
              )}
              {editing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {editing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="border rounded px-2 py-1 flex-1"
                    />
                  ) : (
                    <span>{userData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {editing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="border rounded px-2 py-1 flex-1"
                    />
                  ) : (
                    <span>{userData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 mt-1" />
                  {editing ? (
                    <textarea
                      value={userData.address}
                      onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                      className="border rounded px-2 py-1 flex-1 resize-none"
                      rows={2}
                    />
                  ) : (
                    <span>{userData.address}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{userData.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{userData.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                <p className="text-2xl font-bold text-gray-900">{userData.loyaltyPoints}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    <span className="font-medium">₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Wishlist</h2>
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border rounded-lg p-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-green-600 font-semibold">₹{item.price}</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}