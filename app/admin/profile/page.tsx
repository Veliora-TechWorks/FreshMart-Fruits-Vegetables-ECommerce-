'use client'

import { useState } from 'react'
import { User, Mail, Phone, Shield, Edit, Save, Camera, Key, Clock, Activity, Settings } from 'lucide-react'

export default function AdminProfilePage() {
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@freshmart.com',
    phone: '+91 9876543210',
    avatar: '',
    role: 'Super Admin',
    department: 'Operations',
    employeeId: 'EMP-001',
    joinedDate: '2023-01-15',
    lastLogin: '2024-01-15T10:30:00Z',
    permissions: ['all'],
    twoFactorEnabled: true
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
      setAdminData(prev => ({ ...prev, avatar: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSave = () => {
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const activityLog = [
    { action: 'Updated product inventory', time: '2024-01-15T09:30:00Z', type: 'update' },
    { action: 'Approved customer review', time: '2024-01-15T08:45:00Z', type: 'approval' },
    { action: 'Generated sales report', time: '2024-01-14T16:20:00Z', type: 'report' },
    { action: 'Added new product category', time: '2024-01-14T14:15:00Z', type: 'create' }
  ]

  const systemStats = [
    { label: 'Total Logins', value: '1,234', icon: Activity },
    { label: 'Actions Performed', value: '5,678', icon: Settings },
    { label: 'Reports Generated', value: '89', icon: Activity },
    { label: 'Days Active', value: '365', icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {adminData.avatar ? (
                <img src={adminData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{adminData.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">{adminData.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{adminData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{adminData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{adminData.employeeId}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Last login: {new Date(adminData.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile Details' },
                { id: 'security', label: 'Security' },
                { id: 'activity', label: 'Activity Log' },
                { id: 'permissions', label: 'Permissions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={adminData.name}
                        onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{adminData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={adminData.email}
                        onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{adminData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={adminData.phone}
                        onChange={(e) => setAdminData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{adminData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    {editing ? (
                      <input
                        type="text"
                        value={adminData.department}
                        onChange={(e) => setAdminData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{adminData.department}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminData.twoFactorEnabled}
                        onChange={(e) => setAdminData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'update' ? 'bg-blue-500' :
                        activity.type === 'approval' ? 'bg-green-500' :
                        activity.type === 'report' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{new Date(activity.time).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Access Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Dashboard Access', 'Order Management', 'Product Management', 'Customer Management',
                    'Inventory Control', 'Reports & Analytics', 'User Management', 'System Settings'
                  ].map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium text-gray-900">{permission}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Granted
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}