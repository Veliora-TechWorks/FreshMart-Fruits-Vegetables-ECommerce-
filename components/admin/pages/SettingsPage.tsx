'use client'

import { useState } from 'react'
import { Save, User, Bell, Shield, Globe, Palette, Database, Mail, Phone, MapPin, Plus, Edit, Trash2, X, Upload, Camera, Key, Users, Settings as SettingsIcon } from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'editor'
  avatar?: string
  status: 'active' | 'inactive'
  lastLogin: string
  permissions: string[]
}

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdDate: string
  lastUsed?: string
  status: 'active' | 'inactive'
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [uploading, setUploading] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@freshmart.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      permissions: ['all']
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane@freshmart.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      permissions: ['orders', 'products', 'customers']
    }
  ])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'API-001',
      name: 'Mobile App API',
      key: 'fm_live_xxxxxxxxxxxxxxxxxx',
      permissions: ['read_products', 'create_orders'],
      createdDate: '2024-01-10',
      lastUsed: '2024-01-15T08:20:00Z',
      status: 'active'
    },
    {
      id: 'API-002',
      name: 'Analytics Integration',
      key: 'fm_live_yyyyyyyyyyyyyyyyyy',
      permissions: ['read_analytics', 'read_reports'],
      createdDate: '2024-01-08',
      status: 'inactive'
    }
  ])

  // CRUD Functions
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

  const handleAddUser = (newUser: Omit<AdminUser, 'id'>) => {
    const user: AdminUser = {
      ...newUser,
      id: `USR-${String(adminUsers.length + 1).padStart(3, '0')}`
    }
    setAdminUsers([...adminUsers, user])
    setShowAddUserModal(false)
  }

  const handleEditUser = (updatedUser: AdminUser) => {
    setAdminUsers(adminUsers.map(u => u.id === updatedUser.id ? updatedUser : u))
    setShowEditUserModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setAdminUsers(adminUsers.filter(u => u.id !== id))
    }
  }

  const handleAddApiKey = (newApiKey: Omit<ApiKey, 'id' | 'key'>) => {
    const apiKey: ApiKey = {
      ...newApiKey,
      id: `API-${String(apiKeys.length + 1).padStart(3, '0')}`,
      key: `fm_live_${Math.random().toString(36).substring(2, 22)}`
    }
    setApiKeys([...apiKeys, apiKey])
    setShowAddApiKeyModal(false)
  }

  const handleDeleteApiKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter(k => k.id !== id))
    }
  }

  const handleToggleApiKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map(k => 
      k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k
    ))
  }
  const [settings, setSettings] = useState({
    general: {
      siteName: 'FreshMart',
      siteDescription: 'Premium Organic Fruits & Vegetables',
      contactEmail: 'admin@freshmart.com',
      contactPhone: '+91 9876543210',
      address: '123 Green Street, Organic City, India',
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      stockAlerts: true,
      customerAlerts: true,
      promotionAlerts: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    appearance: {
      theme: 'light',
      primaryColor: '#80B500',
      accentColor: '#FFD700',
      logoUrl: '/logo.png'
    },
    integrations: {
      paymentGateway: 'razorpay',
      shippingProvider: 'delhivery',
      smsProvider: 'twilio',
      emailProvider: 'sendgrid'
    }
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const saveSettings = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your application settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: Globe },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'integrations', label: 'Integrations', icon: Database },
              { id: 'users', label: 'Admin Users', icon: Users },
              { id: 'api', label: 'API Keys', icon: Key }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.general.contactPhone}
                      onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={settings.general.address}
                    onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'smsNotifications' && 'Receive notifications via SMS'}
                        {key === 'orderAlerts' && 'Get notified about new orders'}
                        {key === 'stockAlerts' && 'Get notified about low stock items'}
                        {key === 'customerAlerts' && 'Get notified about customer activities'}
                        {key === 'promotionAlerts' && 'Get notified about promotional campaigns'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Appearance Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.appearance.accentColor}
                        onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.appearance.accentColor}
                        onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Third-party Integrations</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                  <select
                    value={settings.integrations.paymentGateway}
                    onChange={(e) => handleSettingChange('integrations', 'paymentGateway', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="razorpay">Razorpay</option>
                    <option value="payu">PayU</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Provider</label>
                  <select
                    value={settings.integrations.shippingProvider}
                    onChange={(e) => handleSettingChange('integrations', 'shippingProvider', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="delhivery">Delhivery</option>
                    <option value="bluedart">Blue Dart</option>
                    <option value="fedex">FedEx</option>
                    <option value="dtdc">DTDC</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
                    <select
                      value={settings.integrations.smsProvider}
                      onChange={(e) => handleSettingChange('integrations', 'smsProvider', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="twilio">Twilio</option>
                      <option value="msg91">MSG91</option>
                      <option value="textlocal">TextLocal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
                    <select
                      value={settings.integrations.emailProvider}
                      onChange={(e) => handleSettingChange('integrations', 'emailProvider', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="ses">Amazon SES</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Admin Users</h3>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                            ) : (
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-600 font-medium text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingUser(user)
                                setShowEditUserModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 p-1"
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
          )}

          {/* API Keys Management */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">API Keys</h3>
                <button 
                  onClick={() => setShowAddApiKeyModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate API Key
                </button>
              </div>
              
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {apiKey.status}
                          </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-3">
                          {apiKey.key}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Permissions: {apiKey.permissions.join(', ')}</div>
                          <div>Created: {new Date(apiKey.createdDate).toLocaleDateString()}</div>
                          {apiKey.lastUsed && (
                            <div>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleToggleApiKeyStatus(apiKey.id)}
                          className={`px-3 py-1 rounded text-sm ${
                            apiKey.status === 'active' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {apiKey.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAdd={handleAddUser}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowEditUserModal(false)
            setEditingUser(null)
          }}
          onEdit={handleEditUser}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Add API Key Modal */}
      {showAddApiKeyModal && (
        <AddApiKeyModal
          onClose={() => setShowAddApiKeyModal(false)}
          onAdd={handleAddApiKey}
        />
      )}
    </div>
  )
}

// Add User Modal Component
function AddUserModal({ onClose, onAdd, uploadToCloudinary, uploading }: {
  onClose: () => void
  onAdd: (user: Omit<AdminUser, 'id'>) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor' as const,
    status: 'active' as const,
    avatar: '',
    permissions: [] as string[]
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, avatar: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      lastLogin: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Admin User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Avatar</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="user-avatar"
                  disabled={uploading}
                />
                <label htmlFor="user-avatar" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload avatar'}
                  </span>
                </label>
                {formData.avatar && (
                  <img src={formData.avatar} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2 mx-auto" />
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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

// Edit User Modal Component
function EditUserModal({ user, onClose, onEdit, uploadToCloudinary, uploading }: {
  user: AdminUser
  onClose: () => void
  onEdit: (user: AdminUser) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar || ''
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, avatar: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit({
      ...user,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Admin User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Avatar</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-user-avatar"
                  disabled={uploading}
                />
                <label htmlFor="edit-user-avatar" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload new avatar'}
                  </span>
                </label>
                {formData.avatar && (
                  <div className="mt-2 text-center">
                    <img src={formData.avatar} alt="Preview" className="w-20 h-20 object-cover rounded-full mx-auto" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                      className="text-red-600 text-sm mt-1"
                    >
                      Remove Avatar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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

// Add API Key Modal Component
function AddApiKeyModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (apiKey: Omit<ApiKey, 'id' | 'key'>) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    status: 'active' as const
  })

  const availablePermissions = [
    'read_products', 'write_products', 'read_orders', 'write_orders',
    'read_customers', 'write_customers', 'read_analytics', 'read_reports'
  ]

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      createdDate: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generate API Key</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Mobile App API"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Permissions</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{permission.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Generate Key
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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