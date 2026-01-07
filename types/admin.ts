export interface DashboardStats {
  todayRevenue: number
  totalOrders: number
  conversionRate: number
  wastageRisk: number
  lowStockItems: number
  highDemandProducts: string[]
}

export interface Order {
  id: string
  customerName: string
  items: number
  total: number
  status: 'pending' | 'packed' | 'out-for-delivery' | 'delivered' | 'cancelled'
  paymentType: 'cod' | 'online'
  orderDate: string
  deliveryDate?: string
}

export interface AdminProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  isOrganic: boolean
  shelfLife: number
  expiryDate: string
  images: string[]
  status: 'active' | 'inactive' | 'out-of-stock'
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  fraudRisk: 'low' | 'medium' | 'high'
  lastOrderDate: string
}

export interface AIInsight {
  id: string
  type: 'demand-forecast' | 'pricing' | 'wastage' | 'inventory'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionRequired: boolean
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}