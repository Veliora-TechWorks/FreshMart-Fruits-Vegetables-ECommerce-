'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Target, Users, ShoppingCart, AlertTriangle, Lightbulb, BarChart3, Plus, Edit, Trash2, X, Upload, Camera } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface AIInsight {
  id: string
  type: 'prediction' | 'recommendation' | 'alert' | 'trend'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  category: string
  data?: any
  image?: string
  status: 'active' | 'implemented' | 'dismissed'
  createdDate: string
}

export default function AIInsightsPage() {
  const { formatPrice } = useIndianCurrency()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingInsight, setEditingInsight] = useState<AIInsight | null>(null)
  const [uploading, setUploading] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: 'AI-001',
      type: 'prediction',
      title: 'Demand Surge Expected for Mangoes',
      description: 'AI predicts 40% increase in mango demand next week due to seasonal trends and weather patterns.',
      confidence: 87,
      impact: 'high',
      category: 'Demand Forecasting',
      data: { expectedIncrease: 40, timeframe: '7 days', currentStock: 150 },
      status: 'active',
      createdDate: '2024-01-15'
    },
    {
      id: 'AI-002',
      type: 'recommendation',
      title: 'Optimize Pricing for Organic Vegetables',
      description: 'Reduce organic vegetable prices by 8% to increase sales volume by 25% based on price elasticity analysis.',
      confidence: 92,
      impact: 'high',
      category: 'Pricing Optimization',
      data: { priceReduction: 8, expectedSalesIncrease: 25 },
      status: 'active',
      createdDate: '2024-01-14'
    },
    {
      id: 'AI-003',
      type: 'alert',
      title: 'Customer Churn Risk Detected',
      description: '15 high-value customers show signs of potential churn. Immediate retention actions recommended.',
      confidence: 78,
      impact: 'medium',
      category: 'Customer Retention',
      data: { customersAtRisk: 15, averageValue: 12500 },
      status: 'active',
      createdDate: '2024-01-13'
    },
    {
      id: 'AI-004',
      type: 'trend',
      title: 'Growing Interest in Exotic Fruits',
      description: 'Search trends and customer behavior indicate 60% increase in exotic fruit interest.',
      confidence: 85,
      impact: 'medium',
      category: 'Market Trends',
      data: { trendIncrease: 60, topProducts: ['Dragon Fruit', 'Passion Fruit', 'Kiwi'] },
      status: 'active',
      createdDate: '2024-01-12'
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

  const handleAddInsight = (newInsight: Omit<AIInsight, 'id'>) => {
    const insight: AIInsight = {
      ...newInsight,
      id: `AI-${String(insights.length + 1).padStart(3, '0')}`
    }
    setInsights([...insights, insight])
    setShowAddModal(false)
  }

  const handleEditInsight = (updatedInsight: AIInsight) => {
    setInsights(insights.map(i => i.id === updatedInsight.id ? updatedInsight : i))
    setShowEditModal(false)
    setEditingInsight(null)
  }

  const handleDeleteInsight = (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      setInsights(insights.filter(i => i.id !== id))
    }
  }

  const handleStatusChange = (id: string, status: 'active' | 'implemented' | 'dismissed') => {
    setInsights(insights.map(i => i.id === id ? { ...i, status } : i))
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="w-5 h-5" />
      case 'recommendation': return <Lightbulb className="w-5 h-5" />
      case 'alert': return <AlertTriangle className="w-5 h-5" />
      case 'trend': return <BarChart3 className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-blue-100 text-blue-600'
      case 'recommendation': return 'bg-green-100 text-green-600'
      case 'alert': return 'bg-red-100 text-red-600'
      case 'trend': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const demandForecast = [
    { product: 'Bananas', currentDemand: 150, predictedDemand: 180, change: 20 },
    { product: 'Apples', currentDemand: 120, predictedDemand: 110, change: -8.3 },
    { product: 'Tomatoes', currentDemand: 200, predictedDemand: 240, change: 20 },
    { product: 'Spinach', currentDemand: 80, predictedDemand: 95, change: 18.8 },
    { product: 'Carrots', currentDemand: 100, predictedDemand: 85, change: -15 }
  ]

  const customerSegments = [
    { segment: 'Premium Buyers', count: 245, avgSpend: 2500, growth: 15.2 },
    { segment: 'Regular Customers', count: 1200, avgSpend: 800, growth: 8.7 },
    { segment: 'Occasional Buyers', count: 800, avgSpend: 350, growth: -2.1 },
    { segment: 'New Customers', count: 150, avgSpend: 450, growth: 25.6 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-600">AI-powered analytics and recommendations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Insight
        </button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Insights</p>
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Impact</p>
              <p className="text-2xl font-bold text-red-600">
                {insights.filter(i => i.impact === 'high').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Predictions</p>
              <p className="text-2xl font-bold text-purple-600">
                {insights.filter(i => i.type === 'prediction').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['overview', 'demand', 'customers', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Latest AI Insights</h3>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(insight.impact)}`}>
                              {insight.impact} impact
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{insight.description}</p>
                          {insight.image && (
                            <img src={insight.image} alt="Insight" className="w-20 h-20 object-cover rounded mb-2" />
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {insight.category}</span>
                            <span>Confidence: {insight.confidence}%</span>
                            <span>Status: {insight.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleStatusChange(insight.id, 'implemented')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Implement
                          </button>
                          <button 
                            onClick={() => {
                              setEditingInsight(insight)
                              setShowEditModal(true)
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInsight(insight.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleStatusChange(insight.id, 'dismissed')}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demand Forecast Tab */}
          {activeTab === 'demand' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">7-Day Demand Forecast</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Demand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted Demand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {demandForecast.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.product}</td>
                        <td className="px-6 py-4 text-gray-600">{item.currentDemand} units</td>
                        <td className="px-6 py-4 text-gray-600">{item.predictedDemand} units</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            {item.change > 0 ? 'Increase Stock' : 'Reduce Orders'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Insights Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Customer Segment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{segment.segment}</h4>
                      <span className={`text-sm font-medium ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customers:</span>
                        <span className="font-medium">{segment.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Spend:</span>
                        <span className="font-medium">{formatPrice(segment.avgSpend)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
              <div className="space-y-4">
                {insights.filter(i => i.type === 'recommendation').map((rec) => (
                  <div key={rec.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                          <p className="text-gray-700 mb-2">{rec.description}</p>
                          <div className="text-sm text-gray-600">
                            Confidence: {rec.confidence}% | Impact: {rec.impact}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusChange(rec.id, 'implemented')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Implement
                        </button>
                        <button 
                          onClick={() => handleStatusChange(rec.id, 'dismissed')}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Dismiss
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

      {/* Add Insight Modal */}
      {showAddModal && (
        <AddInsightModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddInsight}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Edit Insight Modal */}
      {showEditModal && editingInsight && (
        <EditInsightModal
          insight={editingInsight}
          onClose={() => {
            setShowEditModal(false)
            setEditingInsight(null)
          }}
          onEdit={handleEditInsight}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}
    </div>
  )
}

// Add Insight Modal Component
function AddInsightModal({ onClose, onAdd, uploadToCloudinary, uploading }: {
  onClose: () => void
  onAdd: (insight: Omit<AIInsight, 'id'>) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    type: 'prediction' as const,
    title: '',
    description: '',
    confidence: 80,
    impact: 'medium' as const,
    category: '',
    status: 'active' as const,
    image: ''
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New AI Insight</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="prediction">Prediction</option>
                  <option value="recommendation">Recommendation</option>
                  <option value="alert">Alert</option>
                  <option value="trend">Trend</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impact</label>
                <select
                  value={formData.impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Demand Forecasting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confidence (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.confidence}
                  onChange={(e) => setFormData(prev => ({ ...prev, confidence: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Supporting Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="insight-image"
                  disabled={uploading}
                />
                <label htmlFor="insight-image" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                </label>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add Insight
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

// Edit Insight Modal Component
function EditInsightModal({ insight, onClose, onEdit, uploadToCloudinary, uploading }: {
  insight: AIInsight
  onClose: () => void
  onEdit: (insight: AIInsight) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    type: insight.type,
    title: insight.title,
    description: insight.description,
    confidence: insight.confidence,
    impact: insight.impact,
    category: insight.category,
    status: insight.status,
    image: insight.image || ''
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit({
      ...insight,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit AI Insight</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="prediction">Prediction</option>
                  <option value="recommendation">Recommendation</option>
                  <option value="alert">Alert</option>
                  <option value="trend">Trend</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impact</label>
                <select
                  value={formData.impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confidence (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.confidence}
                  onChange={(e) => setFormData(prev => ({ ...prev, confidence: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="implemented">Implemented</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Supporting Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-insight-image"
                  disabled={uploading}
                />
                <label htmlFor="edit-insight-image" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload new image'}
                  </span>
                </label>
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-red-600 text-sm mt-1"
                    >
                      Remove Image
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
                Update Insight
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