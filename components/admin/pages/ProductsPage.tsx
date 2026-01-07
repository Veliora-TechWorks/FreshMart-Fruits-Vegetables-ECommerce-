'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'
import SimpleProductForm from '../SimpleProductForm'

interface Product {
  _id?: string
  name: string
  category: string
  price: number
  originalPrice?: number
  stock: number
  unit: string
  organic: boolean
  featured: boolean
  description: string
  images: Array<{ url: string; alt?: string }>
}

export default function ProductsPage() {
  const { formatPrice } = useIndianCurrency()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const categories = ['fruits', 'vegetables', 'herbs', 'organic']
  const units = ['kg', 'piece', 'bunch', 'pack']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  }) : []

  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchProducts()
          alert('Product deleted successfully!')
        } else {
          throw new Error('Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images[0]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex gap-1">
                    {product.organic && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Organic
                      </span>
                    )}
                    {product.featured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-sm text-gray-600 mb-3">{product.unit}</p>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="font-bold text-green-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id!)}
                    className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <SimpleProductForm 
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  )
}