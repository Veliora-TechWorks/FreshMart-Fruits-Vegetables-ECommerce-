'use client'

import { useState } from 'react'
import { Download, Calendar, Filter, TrendingUp, TrendingDown, BarChart3, PieChart, Plus, Edit, Trash2, X, Upload, Camera, FileText } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface ReportData {
  period: string
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
}

interface CustomReport {
  id: string
  title: string
  description: string
  type: 'sales' | 'products' | 'customers' | 'inventory' | 'financial'
  dateRange: string
  createdDate: string
  status: 'draft' | 'published' | 'archived'
  image?: string
  data?: any
}

export default function ReportsPage() {
  const { formatPrice } = useIndianCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [reportType, setReportType] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null)
  const [uploading, setUploading] = useState(false)
  const [customReports, setCustomReports] = useState<CustomReport[]>([
    {
      id: 'RPT-001',
      title: 'Monthly Sales Analysis',
      description: 'Comprehensive analysis of monthly sales performance and trends',
      type: 'sales',
      dateRange: 'January 2024',
      createdDate: '2024-01-15',
      status: 'published'
    },
    {
      id: 'RPT-002',
      title: 'Customer Behavior Report',
      description: 'Deep dive into customer purchasing patterns and preferences',
      type: 'customers',
      dateRange: 'Q4 2023',
      createdDate: '2024-01-10',
      status: 'published'
    },
    {
      id: 'RPT-003',
      title: 'Product Performance Dashboard',
      description: 'Analysis of top-performing and underperforming products',
      type: 'products',
      dateRange: 'Last 90 days',
      createdDate: '2024-01-08',
      status: 'draft'
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

  const handleAddReport = (newReport: Omit<CustomReport, 'id'>) => {
    const report: CustomReport = {
      ...newReport,
      id: `RPT-${String(customReports.length + 1).padStart(3, '0')}`
    }
    setCustomReports([...customReports, report])
    setShowAddModal(false)
  }

  const handleEditReport = (updatedReport: CustomReport) => {
    setCustomReports(customReports.map(r => r.id === updatedReport.id ? updatedReport : r))
    setShowEditModal(false)
    setEditingReport(null)
  }

  const handleDeleteReport = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setCustomReports(customReports.filter(r => r.id !== id))
    }
  }

  const handleStatusChange = (id: string, status: 'draft' | 'published' | 'archived') => {
    setCustomReports(customReports.map(r => r.id === id ? { ...r, status } : r))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-blue-100 text-blue-800'
      case 'products': return 'bg-green-100 text-green-800'
      case 'customers': return 'bg-purple-100 text-purple-800'
      case 'inventory': return 'bg-orange-100 text-orange-800'
      case 'financial': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const reportData: ReportData[] = [
    { period: 'Jan 1-7', revenue: 125000, orders: 245, customers: 180, avgOrderValue: 510 },
    { period: 'Jan 8-14', revenue: 142000, orders: 278, customers: 205, avgOrderValue: 511 },
    { period: 'Jan 15-21', revenue: 138000, orders: 265, customers: 195, avgOrderValue: 521 },
    { period: 'Jan 22-28', revenue: 156000, orders: 298, customers: 220, avgOrderValue: 523 }
  ]

  const categoryData = [
    { category: 'Fruits', revenue: 180000, percentage: 45, orders: 520 },
    { category: 'Vegetables', revenue: 140000, percentage: 35, orders: 420 },
    { category: 'Herbs', revenue: 60000, percentage: 15, orders: 180 },
    { category: 'Exotic', revenue: 20000, percentage: 5, orders: 60 }
  ]

  const topProducts = [
    { name: 'Fresh Bananas', revenue: 45000, units: 750, growth: 12.5 },
    { name: 'Organic Apples', revenue: 38000, units: 211, growth: 8.3 },
    { name: 'Red Tomatoes', revenue: 32000, units: 640, growth: -2.1 },
    { name: 'Green Spinach', revenue: 28000, units: 700, growth: 15.7 },
    { name: 'Fresh Carrots', revenue: 25000, units: 500, growth: 5.2 }
  ]

  const customerMetrics = [
    { metric: 'New Customers', value: 156, change: 23.5, trend: 'up' },
    { metric: 'Returning Customers', value: 342, change: 8.7, trend: 'up' },
    { metric: 'Customer Retention Rate', value: 68.5, change: 4.2, trend: 'up' },
    { metric: 'Avg Customer Lifetime Value', value: 2450, change: -1.8, trend: 'down' }
  ]

  const getColorByIndex = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive business insights and reports</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['overview', 'sales', 'products', 'customers', 'custom'].map((tab) => (
              <button
                key={tab}
                onClick={() => setReportType(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  reportType === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'custom' ? 'Custom Reports' : `${tab} Report`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Report */}
          {reportType === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatPrice(561000)}</p>
                      <p className="text-sm text-blue-100 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +12.5% from last period
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Orders</p>
                      <p className="text-2xl font-bold">1,086</p>
                      <p className="text-sm text-green-100 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +8.3% from last period
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">New Customers</p>
                      <p className="text-2xl font-bold">800</p>
                      <p className="text-sm text-purple-100 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +15.2% from last period
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Avg Order Value</p>
                      <p className="text-2xl font-bold">{formatPrice(516)}</p>
                      <p className="text-sm text-yellow-100 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +2.1% from last period
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-yellow-200" />
                  </div>
                </div>
              </div>

              {/* Revenue Trend Chart */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-200 rounded-t flex items-end justify-center"
                        style={{ height: `${(data.revenue / 160000) * 100}%` }}
                      >
                        <div
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: '80%' }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-center">
                        <div className="font-medium">{formatPrice(data.revenue)}</div>
                        <div className="text-gray-500">{data.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sales Report */}
          {reportType === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${getColorByIndex(index)}`}></div>
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(category.revenue)}</div>
                          <div className="text-sm text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Performance */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-green-600">3.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cart Abandonment</span>
                      <span className="font-semibold text-red-600">24.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Return Rate</span>
                      <span className="font-semibold text-yellow-600">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-semibold text-green-600">4.6/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Report */}
          {reportType === 'products' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Top Performing Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600">{formatPrice(product.revenue)}</td>
                        <td className="px-6 py-4 text-gray-600">{product.units}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {Math.abs(product.growth)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min((product.revenue / 50000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers Report */}
          {reportType === 'customers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Customer Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.metric.includes('Value') ? formatPrice(metric.value) : 
                           metric.metric.includes('Rate') ? `${metric.value}%` : metric.value}
                        </p>
                      </div>
                      <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="ml-1 font-medium">{Math.abs(metric.change)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Custom Reports */}
          {reportType === 'custom' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Custom Reports</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                    
                    {report.image && (
                      <img src={report.image} alt="Report" className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <div>Range: {report.dateRange}</div>
                      <div>Created: {new Date(report.createdDate).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setEditingReport(report)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex space-x-1">
                        {report.status === 'draft' && (
                          <button 
                            onClick={() => handleStatusChange(report.id, 'published')}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                        {report.status === 'published' && (
                          <button 
                            onClick={() => handleStatusChange(report.id, 'archived')}
                            className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            Archive
                          </button>
                        )}
                        <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">
                          <Download className="w-3 h-3" />
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

      {/* Add Report Modal */}
      {showAddModal && (
        <AddReportModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddReport}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Edit Report Modal */}
      {showEditModal && editingReport && (
        <EditReportModal
          report={editingReport}
          onClose={() => {
            setShowEditModal(false)
            setEditingReport(null)
          }}
          onEdit={handleEditReport}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}
    </div>
  )
}

// Add Report Modal Component
function AddReportModal({ onClose, onAdd, uploadToCloudinary, uploading }: {
  onClose: () => void
  onAdd: (report: Omit<CustomReport, 'id'>) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'sales' as const,
    dateRange: '',
    status: 'draft' as const,
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
            <h3 className="text-lg font-semibold">Create New Report</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter report title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe what this report covers"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sales">Sales</option>
                  <option value="products">Products</option>
                  <option value="customers">Customers</option>
                  <option value="inventory">Inventory</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <input
                  type="text"
                  required
                  value={formData.dateRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., January 2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Report Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="report-image"
                  disabled={uploading}
                />
                <label htmlFor="report-image" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload cover image'}
                  </span>
                </label>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Create Report
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

// Edit Report Modal Component
function EditReportModal({ report, onClose, onEdit, uploadToCloudinary, uploading }: {
  report: CustomReport
  onClose: () => void
  onEdit: (report: CustomReport) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    title: report.title,
    description: report.description,
    type: report.type,
    dateRange: report.dateRange,
    status: report.status,
    image: report.image || ''
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
      ...report,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Report</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Title</label>
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
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sales">Sales</option>
                  <option value="products">Products</option>
                  <option value="customers">Customers</option>
                  <option value="inventory">Inventory</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <input
                  type="text"
                  required
                  value={formData.dateRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Report Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-report-image"
                  disabled={uploading}
                />
                <label htmlFor="edit-report-image" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload new image'}
                  </span>
                </label>
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded" />
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
                Update Report
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