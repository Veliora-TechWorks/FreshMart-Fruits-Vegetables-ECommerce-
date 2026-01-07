'use client'

import { useState } from 'react'
import { Search, Star, ThumbsUp, ThumbsDown, Eye, MessageSquare, Filter, Flag, X, Plus, Edit, Trash2, Upload, Camera } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface Review {
  id: string
  customer: string
  product: string
  rating: number
  title: string
  comment: string
  date: string
  status: 'approved' | 'pending' | 'rejected'
  helpful: number
  verified: boolean
  images?: string[]
  adminReply?: string
  replyDate?: string
}

export default function ReviewsPage() {
  const { formatPrice } = useIndianCurrency()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [replyingReview, setReplyingReview] = useState<Review | null>(null)
  const [uploading, setUploading] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'REV-001',
      customer: 'Rajesh Kumar',
      product: 'Fresh Bananas',
      rating: 5,
      title: 'Excellent quality bananas!',
      comment: 'The bananas were fresh, sweet, and perfectly ripe. Great quality and fast delivery. Will definitely order again!',
      date: '2024-01-15',
      status: 'approved',
      helpful: 12,
      verified: true,
      images: ['/api/placeholder/100/100']
    },
    {
      id: 'REV-002',
      customer: 'Priya Sharma',
      product: 'Organic Apples',
      rating: 4,
      title: 'Good apples but expensive',
      comment: 'The apples were fresh and organic as promised. However, I found them a bit expensive compared to local markets.',
      date: '2024-01-14',
      status: 'approved',
      helpful: 8,
      verified: true
    },
    {
      id: 'REV-003',
      customer: 'Amit Patel',
      product: 'Green Spinach',
      rating: 2,
      title: 'Not fresh enough',
      comment: 'The spinach leaves were wilted and not as fresh as expected. Packaging could be better.',
      date: '2024-01-13',
      status: 'pending',
      helpful: 3,
      verified: false
    },
    {
      id: 'REV-004',
      customer: 'Sneha Reddy',
      product: 'Red Tomatoes',
      rating: 5,
      title: 'Perfect tomatoes for cooking',
      comment: 'These tomatoes were perfect for my recipes. Fresh, juicy, and well-packaged. Highly recommended!',
      date: '2024-01-12',
      status: 'approved',
      helpful: 15,
      verified: true
    },
    {
      id: 'REV-005',
      customer: 'Vikram Singh',
      product: 'Fresh Carrots',
      rating: 1,
      title: 'Poor quality and late delivery',
      comment: 'The carrots were old and soft. Delivery was also delayed by 2 days. Very disappointed with the service.',
      date: '2024-01-11',
      status: 'rejected',
      helpful: 1,
      verified: true
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

  const handleAddReview = (newReview: Omit<Review, 'id'>) => {
    const review: Review = {
      ...newReview,
      id: `REV-${String(reviews.length + 1).padStart(3, '0')}`
    }
    setReviews([...reviews, review])
    setShowAddModal(false)
  }

  const handleEditReview = (updatedReview: Review) => {
    setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r))
    setShowEditModal(false)
    setEditingReview(null)
  }

  const handleDeleteReview = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id))
    }
  }

  const handleStatusChange = (id: string, status: 'approved' | 'pending' | 'rejected') => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r))
  }

  const handleReply = (id: string, reply: string) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, adminReply: reply, replyDate: new Date().toISOString().split('T')[0] } : r
    ))
    setShowReplyModal(false)
    setReplyingReview(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    return matchesSearch && matchesStatus && matchesRating
  })

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length
  const pendingReviews = reviews.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
          <p className="text-gray-600">Manage customer reviews and ratings</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 mr-2">{averageRating.toFixed(1)}</p>
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingReviews}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Reviews</p>
              <p className="text-2xl font-bold text-green-600">
                {reviews.filter(r => r.verified).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ThumbsUp className="w-6 h-6 text-green-600" />
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
              placeholder="Search reviews..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{review.customer}</h4>
                      {review.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{review.product}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Review"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {review.helpful} helpful
                  </div>
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                  {review.status}
                </span>
                <div className="flex space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Approve"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Reject"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setEditingReview(review)
                      setShowEditModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setReplyingReview(review)
                      setShowReplyModal(true)
                    }}
                    className="text-purple-600 hover:text-purple-800 p-1"
                    title="Reply"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Review Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">
                      {selectedReview.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedReview.customer}</h4>
                    <p className="text-gray-500">{selectedReview.product}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="font-medium">{selectedReview.rating}/5</span>
                  </div>
                  <h5 className="font-medium text-lg mb-2">{selectedReview.title}</h5>
                  <p className="text-gray-700 mb-4">{selectedReview.comment}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span> {new Date(selectedReview.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReview.status)}`}>
                      {selectedReview.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Helpful votes:</span> {selectedReview.helpful}
                  </div>
                  <div>
                    <span className="font-medium">Verified:</span> {selectedReview.verified ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button 
                    onClick={() => handleStatusChange(selectedReview.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => {
                      setReplyingReview(selectedReview)
                      setShowReplyModal(true)
                      setSelectedReview(null)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <AddReviewModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddReview}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => {
            setShowEditModal(false)
            setEditingReview(null)
          }}
          onEdit={handleEditReview}
          uploadToCloudinary={uploadToCloudinary}
          uploading={uploading}
        />
      )}

      {/* Reply Modal */}
      {showReplyModal && replyingReview && (
        <ReplyModal
          review={replyingReview}
          onClose={() => {
            setShowReplyModal(false)
            setReplyingReview(null)
          }}
          onReply={handleReply}
        />
      )}
    </div>
  )
}

// Add Review Modal Component
function AddReviewModal({ onClose, onAdd, uploadToCloudinary, uploading }: {
  onClose: () => void
  onAdd: (review: Omit<Review, 'id'>) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    rating: 5,
    title: '',
    comment: '',
    status: 'pending' as 'approved' | 'pending' | 'rejected',
    verified: false,
    images: [] as string[]
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploadPromises = Array.from(files).map(uploadToCloudinary)
    try {
      const urls = await Promise.all(uploadPromises)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (error) {
      alert('Failed to upload images')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'approved' | 'pending' | 'rejected' }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="review-images"
                  disabled={uploading}
                />
                <label htmlFor="review-images" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload review images'}
                  </span>
                </label>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, index) => (
                      <img key={index} src={url} alt="Review" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="verified" className="text-sm">Verified Purchase</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add Review
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

// Edit Review Modal Component
function EditReviewModal({ review, onClose, onEdit, uploadToCloudinary, uploading }: {
  review: Review
  onClose: () => void
  onEdit: (review: Review) => void
  uploadToCloudinary: (file: File) => Promise<string>
  uploading: boolean
}) {
  const [formData, setFormData] = useState({
    customer: review.customer,
    product: review.product,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    status: review.status,
    verified: review.verified,
    images: review.images || []
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploadPromises = Array.from(files).map(uploadToCloudinary)
    try {
      const urls = await Promise.all(uploadPromises)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (error) {
      alert('Failed to upload images')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit({
      ...review,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'approved' | 'pending' | 'rejected' }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-review-images"
                  disabled={uploading}
                />
                <label htmlFor="edit-review-images" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload more images'}
                  </span>
                </label>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="Review" className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-verified"
                checked={formData.verified}
                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="edit-verified" className="text-sm">Verified Purchase</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Update Review
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

// Reply Modal Component
function ReplyModal({ review, onClose, onReply }: {
  review: Review
  onClose: () => void
  onReply: (id: string, reply: string) => void
}) {
  const [reply, setReply] = useState(review.adminReply || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reply.trim()) {
      onReply(review.id, reply)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Reply to Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{review.title}</p>
            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">by {review.customer}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Reply</label>
              <textarea
                required
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply to this review..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Send Reply
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