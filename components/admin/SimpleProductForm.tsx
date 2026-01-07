'use client'

import { useState } from 'react'
import { Upload, X, Plus, Trash2, Star } from 'lucide-react'

interface ProductFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function SimpleProductForm({ onClose, onSuccess }: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('fruits')
  const [unit, setUnit] = useState('kg')
  const [organic, setOrganic] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [rating, setRating] = useState('')
  const [reviews, setReviews] = useState('')
  const [brand, setBrand] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [offerText, setOfferText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isFresh, setIsFresh] = useState(true)
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [isSeasonal, setIsSeasonal] = useState(false)
  const [freshnessScore, setFreshnessScore] = useState('95')
  const [unitOptions, setUnitOptions] = useState([
    { value: 1, label: '1 kg', multiplier: 1 },
    { value: 0.5, label: '500g', multiplier: 0.5 },
    { value: 2, label: '2 kg', multiplier: 2 }
  ])

  const categories = ['fruits', 'vegetables', 'herbs', 'organic', 'dairy', 'grains', 'spices']
  const units = ['kg', 'piece', 'bunch', 'pack', 'liter', 'gram', 'dozen']

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error('Upload failed: ' + errorText)
      }
      
      const data = await response.json()
      setImageUrl(data.url)
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImage(file)
  }

  const addBadge = () => {
    // Removed badge functionality for simplicity
  }

  const removeBadge = (index: number) => {
    // Removed badge functionality for simplicity
  }

  const addUnitOption = () => {
    setUnitOptions([...unitOptions, { value: 1, label: '1 unit', multiplier: 1 }])
  }

  const removeUnitOption = (index: number) => {
    if (unitOptions.length > 1) {
      setUnitOptions(unitOptions.filter((_, i) => i !== index))
    }
  }

  const updateUnitOption = (index: number, field: string, value: any) => {
    const updated = [...unitOptions]
    updated[index] = { ...updated[index], [field]: value }
    setUnitOptions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!name.trim()) {
      alert('Please enter product name')
      return
    }
    if (!description.trim()) {
      alert('Please enter product description')
      return
    }
    if (!price || Number(price) <= 0) {
      alert('Please enter a valid price')
      return
    }
    if (!stock || Number(stock) < 0) {
      alert('Please enter a valid stock quantity')
      return
    }
    if (!imageUrl) {
      alert('Please upload a product image')
      return
    }

    setSubmitting(true)
    try {
      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        category,
        unit,
        organic,
        featured,
        brand: brand.trim() || undefined,
        deliveryTime: deliveryTime || undefined,
        offerText: offerText.trim() || undefined,
        images: [{ url: imageUrl, alt: name }],
        isFresh,
        isBestSeller,
        isSeasonal,
        freshnessScore: Number(freshnessScore),
        unitOptions
      }

      console.log('Submitting product:', productData)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        alert('Product added successfully!')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        alert(`Failed to add product: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Describe your product"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Stock</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category & Unit */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Classification</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Brand & Delivery */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Brand & Delivery</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g. fresho!, Organic India"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select delivery time</option>
                    <option value="10 MINS">10 MINS</option>
                    <option value="15 MINS">15 MINS</option>
                    <option value="30 MINS">30 MINS</option>
                    <option value="1 HOUR">1 HOUR</option>
                    <option value="2 HOURS">2 HOURS</option>
                    <option value="SAME DAY">SAME DAY</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Text</label>
                <input
                  type="text"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g. Har Din Sasta!, Fresh & Crispy!, Farm Fresh Daily!"
                />
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Product Flags</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organic}
                    onChange={(e) => setOrganic(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Organic Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFresh}
                    onChange={(e) => setIsFresh(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Fresh Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Best Seller</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeasonal}
                    onChange={(e) => setIsSeasonal(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Seasonal Product</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Freshness Score (%)</label>
                  <input
                    type="number"
                    value={freshnessScore}
                    onChange={(e) => setFreshnessScore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Unit Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">Unit Options</h4>
                <button
                  type="button"
                  onClick={addUnitOption}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Unit
                </button>
              </div>
              
              <div className="space-y-3">
                {unitOptions.map((unit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="number"
                      value={unit.value}
                      onChange={(e) => updateUnitOption(index, 'value', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                      step="0.1"
                      min="0"
                    />
                    <input
                      type="text"
                      value={unit.label}
                      onChange={(e) => updateUnitOption(index, 'label', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                      placeholder="e.g., 1 kg, 500g, 1 piece"
                    />
                    <input
                      type="number"
                      value={unit.multiplier}
                      onChange={(e) => updateUnitOption(index, 'multiplier', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                      step="0.1"
                      min="0"
                    />
                    {unitOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUnitOption(index)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Product Image</h4>
              
              {imageUrl && (
                <div className="mb-4">
                  <img 
                    src={imageUrl} 
                    alt="Product preview" 
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm" 
                  />
                </div>
              )}
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploading ? 'Uploading...' : 'Upload Product Image'}
                </p>
                <p className="text-sm text-gray-500">
                  Click to select or drag and drop (Max 5MB)
                </p>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={uploading || submitting}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg"
              >
                {submitting ? 'Adding Product...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
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