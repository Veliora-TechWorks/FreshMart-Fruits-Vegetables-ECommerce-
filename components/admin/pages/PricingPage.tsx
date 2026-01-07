'use client'

import { useState, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Tag, Percent, Calendar, Target, X, Upload } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface Offer {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'bogo'
  value: number
  minOrder: number
  maxDiscount: number
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'expired'
  usageCount: number
  usageLimit: number
  applicableProducts: string[]
  image?: string
  description?: string
}

interface PriceRule {
  id: string
  name: string
  category: string
  basePrice: number
  discountedPrice: number
  discountPercentage: number
  validFrom: string
  validTo: string
  status: 'active' | 'inactive'
  image?: string
  description?: string
}

export default function PricingPage() {
  const { formatPrice } = useIndianCurrency()
  const [activeTab, setActiveTab] = useState('offers')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [selectedRule, setSelectedRule] = useState<PriceRule | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 'OFF-001',
      name: 'New Year Special',
      type: 'percentage',
      value: 20,
      minOrder: 500,
      maxDiscount: 200,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      usageCount: 145,
      usageLimit: 1000,
      applicableProducts: ['all'],
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=100&h=100&fit=crop',
      description: 'Special New Year discount for all products'
    },
    {
      id: 'OFF-002',
      name: 'Free Delivery',
      type: 'fixed',
      value: 50,
      minOrder: 300,
      maxDiscount: 50,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      usageCount: 89,
      usageLimit: 500,
      applicableProducts: ['all'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      description: 'Free delivery on orders above ₹300'
    },
    {
      id: 'OFF-003',
      name: 'Buy 2 Get 1 Free',
      type: 'bogo',
      value: 1,
      minOrder: 0,
      maxDiscount: 0,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      status: 'active',
      usageCount: 67,
      usageLimit: 200,
      applicableProducts: ['Fruits'],
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&h=100&fit=crop',
      description: 'Buy 2 fruits and get 1 free'
    }
  ])

  const [priceRules, setPriceRules] = useState<PriceRule[]>([
    {
      id: 'PR-001',
      name: 'Seasonal Fruits Discount',
      category: 'Fruits',
      basePrice: 180,
      discountedPrice: 150,
      discountPercentage: 16.7,
      validFrom: '2024-01-01',
      validTo: '2024-01-31',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=100&h=100&fit=crop',
      description: 'Seasonal discount on all fruits'
    },
    {
      id: 'PR-002',
      name: 'Vegetable Bundle Offer',
      category: 'Vegetables',
      basePrice: 200,
      discountedPrice: 170,
      discountPercentage: 15,
      validFrom: '2024-01-15',
      validTo: '2024-02-15',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop',
      description: 'Special bundle pricing for vegetables'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOfferTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />
      case 'fixed': return <Tag className="w-4 h-4" />
      case 'bogo': return <Target className="w-4 h-4" />
      default: return <Tag className="w-4 h-4" />
    }
  }

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

  const addOffer = (offerData: Omit<Offer, 'id' | 'usageCount'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `OFF-${String(offers.length + 1).padStart(3, '0')}`,
      usageCount: 0
    }
    setOffers(prev => [...prev, newOffer])
    setShowAddModal(false)
  }

  const updateOffer = (id: string, offerData: Omit<Offer, 'id' | 'usageCount'>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...offerData, id, usageCount: o.usageCount } : o))
    setSelectedOffer(null)
  }

  const deleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(o => o.id !== id))
    }
  }

  const addPriceRule = (ruleData: Omit<PriceRule, 'id' | 'discountPercentage'>) => {
    const discountPercentage = ((ruleData.basePrice - ruleData.discountedPrice) / ruleData.basePrice) * 100
    const newRule: PriceRule = {
      ...ruleData,
      id: `PR-${String(priceRules.length + 1).padStart(3, '0')}`,
      discountPercentage
    }
    setPriceRules(prev => [...prev, newRule])
    setShowAddModal(false)
  }

  const updatePriceRule = (id: string, ruleData: Omit<PriceRule, 'id' | 'discountPercentage'>) => {
    const discountPercentage = ((ruleData.basePrice - ruleData.discountedPrice) / ruleData.basePrice) * 100
    setPriceRules(prev => prev.map(r => r.id === id ? { ...ruleData, id, discountPercentage } : r))
    setSelectedRule(null)
  }

  const deletePriceRule = (id: string) => {
    if (confirm('Are you sure you want to delete this price rule?')) {
      setPriceRules(prev => prev.filter(r => r.id !== id))
    }
  }

  const OfferForm = ({ offer, onClose }: { offer?: Offer, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: offer?.name || '',
      type: offer?.type || 'percentage' as Offer['type'],
      value: offer?.value || 0,
      minOrder: offer?.minOrder || 0,
      maxDiscount: offer?.maxDiscount || 0,
      startDate: offer?.startDate || new Date().toISOString().split('T')[0],
      endDate: offer?.endDate || new Date().toISOString().split('T')[0],
      status: offer?.status || 'active' as Offer['status'],
      usageLimit: offer?.usageLimit || 100,
      applicableProducts: offer?.applicableProducts || ['all'],
      image: offer?.image || '',
      description: offer?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (offer) {
        updateOffer(offer.id, formData)
      } else {
        addOffer(formData)
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
                {offer ? 'Edit Offer' : 'Create New Offer'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Offer['type'] }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
                  placeholder="Offer description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image</label>
                {formData.image && (
                  <div className="mb-2">
                    <img src={formData.image} alt="Offer" className="w-20 h-20 object-cover rounded" />
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
                  {uploading ? 'Uploading...' : offer ? 'Update Offer' : 'Create Offer'}
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
          <h2 className="text-2xl font-bold text-gray-900">Pricing & Offers</h2>
          <p className="text-gray-600">Manage discounts, offers, and pricing rules</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true)
            setSelectedOffer(null)
            setSelectedRule(null)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['offers', 'pricing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'offers' ? 'Active Offers' : 'Pricing Rules'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {offer.image && (
                        <img src={offer.image} alt={offer.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div className="p-2 bg-green-100 rounded-lg">
                        {getOfferTypeIcon(offer.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                        <p className="text-sm text-gray-500">
                          {offer.type === 'percentage' && `${offer.value}% off`}
                          {offer.type === 'fixed' && `₹${offer.value} off`}
                          {offer.type === 'bogo' && 'Buy 2 Get 1 Free'}
                          {offer.minOrder > 0 && ` on orders above ${formatPrice(offer.minOrder)}`}
                        </p>
                        {offer.description && (
                          <p className="text-xs text-gray-400 mt-1">{offer.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{offer.usageCount}/{offer.usageLimit} used</p>
                        <p className="text-xs text-gray-500">
                          {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedOffer(offer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteOffer(offer.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Rules Tab */}
          {activeTab === 'pricing' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounted Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {rule.image && (
                            <img className="h-10 w-10 rounded-full mr-3" src={rule.image} alt={rule.name} />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{rule.name}</div>
                            {rule.description && (
                              <div className="text-sm text-gray-500">{rule.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rule.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(rule.basePrice)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{formatPrice(rule.discountedPrice)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.discountPercentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rule.validFrom).toLocaleDateString()} - {new Date(rule.validTo).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rule.status)}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedRule(rule)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deletePriceRule(rule.id)}
                            className="text-red-600 hover:text-red-800"
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
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <OfferForm onClose={() => setShowAddModal(false)} />}
      {selectedOffer && (
        <OfferForm 
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)} 
        />
      )}
    </div>
  )
}