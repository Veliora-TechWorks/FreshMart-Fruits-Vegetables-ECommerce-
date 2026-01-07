'use client'

import { useState, useRef } from 'react'
import { Search, AlertTriangle, TrendingUp, TrendingDown, Package, RefreshCw, Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  lastRestocked: string
  supplier: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  image?: string
  description?: string
}

export default function InventoryPage() {
  const { formatPrice } = useIndianCurrency()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Fresh Bananas',
      sku: 'FRT-BAN-001',
      category: 'Fruits',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unitPrice: 60,
      totalValue: 9000,
      lastRestocked: '2024-01-10',
      supplier: 'Kerala Fruits Co.',
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop',
      description: 'Fresh organic bananas from Kerala'
    },
    {
      id: '2',
      name: 'Organic Apples',
      sku: 'FRT-APP-001',
      category: 'Fruits',
      currentStock: 25,
      minStock: 30,
      maxStock: 200,
      unitPrice: 180,
      totalValue: 4500,
      lastRestocked: '2024-01-08',
      supplier: 'Himachal Organics',
      status: 'low-stock',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop',
      description: 'Premium organic apples from Himachal Pradesh'
    },
    {
      id: '3',
      name: 'Green Spinach',
      sku: 'VEG-SPN-001',
      category: 'Vegetables',
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unitPrice: 40,
      totalValue: 0,
      lastRestocked: '2024-01-05',
      supplier: 'Local Farmers',
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop',
      description: 'Fresh green spinach leaves'
    },
    {
      id: '4',
      name: 'Red Tomatoes',
      sku: 'VEG-TOM-001',
      category: 'Vegetables',
      currentStock: 120,
      minStock: 40,
      maxStock: 250,
      unitPrice: 50,
      totalValue: 6000,
      lastRestocked: '2024-01-12',
      supplier: 'Fresh Veggie Suppliers',
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1546470427-e5380e0e8b5e?w=100&h=100&fit=crop',
      description: 'Fresh red tomatoes'
    }
  ])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current === 0) return { level: 'Empty', color: 'bg-red-500' }
    if (current <= min) return { level: 'Low', color: 'bg-yellow-500' }
    if (percentage >= 80) return { level: 'High', color: 'bg-green-500' }
    return { level: 'Normal', color: 'bg-blue-500' }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
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

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'totalValue'>) => {
    const totalValue = itemData.currentStock * itemData.unitPrice
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
      totalValue,
      status: itemData.currentStock === 0 ? 'out-of-stock' : 
              itemData.currentStock <= itemData.minStock ? 'low-stock' : 'in-stock'
    }
    setInventory(prev => [...prev, newItem])
    setShowAddModal(false)
  }

  const updateInventoryItem = (id: string, itemData: Omit<InventoryItem, 'id' | 'totalValue'>) => {
    const totalValue = itemData.currentStock * itemData.unitPrice
    const updatedItem = {
      ...itemData,
      id,
      totalValue,
      status: itemData.currentStock === 0 ? 'out-of-stock' : 
              itemData.currentStock <= itemData.minStock ? 'low-stock' : 'in-stock'
    } as InventoryItem
    
    setInventory(prev => prev.map(i => i.id === id ? updatedItem : i))
    setSelectedItem(null)
  }

  const deleteInventoryItem = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      setInventory(prev => prev.filter(i => i.id !== id))
    }
  }

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter(item => item.status === 'low-stock').length
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length

  const InventoryForm = ({ item, onClose }: { item?: InventoryItem | null, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: item?.name || '',
      sku: item?.sku || '',
      category: item?.category || 'Fruits',
      currentStock: item?.currentStock || 0,
      minStock: item?.minStock || 0,
      maxStock: item?.maxStock || 0,
      unitPrice: item?.unitPrice || 0,
      lastRestocked: item?.lastRestocked || new Date().toISOString().split('T')[0],
      supplier: item?.supplier || '',
      image: item?.image || '',
      description: item?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const status = formData.currentStock === 0 ? 'out-of-stock' : 
                    formData.currentStock <= formData.minStock ? 'low-stock' : 'in-stock'
      const formDataWithStatus = { ...formData, status } as Omit<InventoryItem, 'id' | 'totalValue'>
      
      if (item) {
        updateInventoryItem(item.id, formDataWithStatus)
      } else {
        addInventoryItem(formDataWithStatus)
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
                {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Exotic">Exotic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Restocked</label>
                  <input
                    type="date"
                    value={formData.lastRestocked}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastRestocked: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                {formData.image && (
                  <div className="mb-2">
                    <img src={formData.image} alt="Product" className="w-20 h-20 object-cover rounded" />
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
                  {uploading ? 'Uploading...' : item ? 'Update Item' : 'Add Item'}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track and manage your stock levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
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
              placeholder="Search inventory..."
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
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min/Max</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image && (
                          <img className="h-10 w-10 rounded-full mr-3" src={item.image} alt={item.name} />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${stockLevel.color}`}
                            style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{stockLevel.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.currentStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minStock} / {item.maxStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(item.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Item"
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

      {/* Add/Edit Item Modal */}
      {(showAddModal || selectedItem) && (
        <InventoryForm 
          item={selectedItem} 
          onClose={() => {
            setSelectedItem(null)
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}