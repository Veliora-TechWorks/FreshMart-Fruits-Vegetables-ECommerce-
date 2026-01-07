'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Bell, Shield, Eye, EyeOff, Save, Camera, Heart, Gift, Leaf, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      avatar: '',
      dateOfBirth: '1990-05-15',
      favoriteCategory: 'organic-fruits'
    },
    address: {
      street: '123 Green Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      nickname: 'Home'
    },
    preferences: {
      orderUpdates: true,
      promotions: true,
      newsletter: true,
      sms: false,
      organicOnly: true,
      localProduce: true,
      seasonalRecommendations: true
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: false
    }
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
      setSettings(prev => ({
        ...prev,
        profile: { ...prev.profile, avatar: url }
      }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSave = () => {
    alert('🎉 Settings saved successfully! Your preferences have been updated.')
  }

  const handlePasswordChange = () => {
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      alert('⚠️ New passwords do not match')
      return
    }
    alert('🔒 Password changed successfully!')
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, currentPassword: '', newPassword: '', confirmPassword: '' }
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤', color: 'green' },
    { id: 'address', label: 'Address', icon: MapPin, emoji: '📍', color: 'blue' },
    { id: 'preferences', label: 'Preferences', icon: Heart, emoji: '❤️', color: 'pink' },
    { id: 'security', label: 'Security', icon: Shield, emoji: '🔒', color: 'purple' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">🌿 Account Settings</h1>
            <p className="text-xl text-green-100">Customize your fresh shopping experience</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-green-500">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative group">
              {settings.profile.avatar ? (
                <img src={settings.profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-green-200" />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-green-200">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                  disabled={uploading}
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </label>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{settings.profile.name}</h2>
              <p className="text-gray-600">{settings.profile.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Organic Lover 🌱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b bg-gray-50">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 py-4 px-6 font-medium text-sm flex items-center justify-center space-x-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-green-600 border-b-2 border-green-500 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.emoji}</span>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">👤 Profile Information</h3>
                  <p className="text-gray-600">Keep your profile fresh and up-to-date</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">📝 Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">📧 Email Address</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">📱 Phone Number</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value }
                      }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">🎂 Date of Birth</label>
                    <input
                      type="date"
                      value={settings.profile.dateOfBirth}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, dateOfBirth: e.target.value }
                      }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3">🌱 Favorite Category</h4>
                  <select
                    value={settings.profile.favoriteCategory}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, favoriteCategory: e.target.value }
                    }))}
                    className="w-full p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-white"
                  >
                    <option value="organic-fruits">🍎 Organic Fruits</option>
                    <option value="fresh-vegetables">🥕 Fresh Vegetables</option>
                    <option value="leafy-greens">🥬 Leafy Greens</option>
                    <option value="exotic-fruits">🥝 Exotic Fruits</option>
                    <option value="herbs-spices">🌿 Herbs & Spices</option>
                  </select>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">📍 Delivery Address</h3>
                  <p className="text-gray-600">Where should we deliver your fresh produce?</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <input
                      type="text"
                      placeholder="Address nickname (e.g., Home, Office)"
                      value={settings.address.nickname}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        address: { ...prev.address, nickname: e.target.value }
                      }))}
                      className="flex-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">🏠 Street Address</label>
                    <input
                      type="text"
                      value={settings.address.street}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">🏙️ City</label>
                      <input
                        type="text"
                        value={settings.address.city}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">🗺️ State</label>
                      <input
                        type="text"
                        value={settings.address.state}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value }
                        }))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">📮 PIN Code</label>
                      <input
                        type="text"
                        value={settings.address.pincode}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          address: { ...prev.address, pincode: e.target.value }
                        }))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">🌍 Country</label>
                      <input
                        type="text"
                        value={settings.address.country}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          address: { ...prev.address, country: e.target.value }
                        }))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">❤️ Your Preferences</h3>
                  <p className="text-gray-600">Customize your FreshMart experience</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Notifications */}
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <h4 className="font-bold text-pink-800 mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      🔔 Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your orders' },
                        { key: 'promotions', label: 'Promotions', desc: 'Special offers and discounts' },
                        { key: 'newsletter', label: 'Newsletter', desc: 'Weekly fresh produce updates' },
                        { key: 'sms', label: 'SMS Alerts', desc: 'Important updates via SMS' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.preferences[item.key as keyof typeof settings.preferences] as boolean}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, [item.key]: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shopping Preferences */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2" />
                      🌱 Shopping Preferences
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: 'organicOnly', label: 'Organic Only', desc: 'Show only organic products' },
                        { key: 'localProduce', label: 'Local Produce', desc: 'Prefer locally sourced items' },
                        { key: 'seasonalRecommendations', label: 'Seasonal Picks', desc: 'Get seasonal recommendations' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.preferences[item.key as keyof typeof settings.preferences] as boolean}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, [item.key]: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🔒 Security Settings</h3>
                  <p className="text-gray-600">Keep your account safe and secure</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-6">🔑 Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.security.currentPassword}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, currentPassword: e.target.value }
                          }))}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-gray-50 focus:bg-white pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">New Password</label>
                        <input
                          type="password"
                          value={settings.security.newPassword}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, newPassword: e.target.value }
                          }))}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
                        <input
                          type="password"
                          value={settings.security.confirmPassword}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, confirmPassword: e.target.value }
                          }))}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                    >
                      🔄 Update Password
                    </button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-yellow-800">🔐 Two-Factor Authentication</h4>
                      <p className="text-sm text-yellow-700 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactor}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'security' && (
              <div className="pt-8 border-t border-gray-200">
                <div className="flex justify-center">
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save className="w-5 h-5" />
                    <span>🎉 Save Changes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}