'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, IndianRupee } from 'lucide-react'
import { useIndianCurrency } from '../IndianCurrencyContext'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
}

export default function DashboardPage() {
  const { formatPrice } = useIndianCurrency()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 2450000,
    totalOrders: 1234,
    totalCustomers: 856,
    totalProducts: 145,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    productsGrowth: 5.7
  })

  const StatCard = ({ title, value, growth, icon: Icon, isPrice = false }: {
    title: string
    value: number
    growth: number
    icon: any
    isPrice?: boolean
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isPrice ? formatPrice(value) : value.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-full">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {growth > 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(growth)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          growth={stats.revenueGrowth}
          icon={IndianRupee}
          isPrice={true}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          growth={stats.ordersGrowth}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          growth={stats.customersGrowth}
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          growth={stats.productsGrowth}
          icon={Package}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 78, 52, 89, 67, 95].map((height, index) => (
              <div key={index} className="flex-1 bg-green-200 rounded-t" style={{ height: `${height}%` }}>
                <div className="w-full bg-green-500 rounded-t" style={{ height: '60%' }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {[
              { name: 'Fresh Bananas', sales: 234, revenue: 23400 },
              { name: 'Organic Apples', sales: 189, revenue: 37800 },
              { name: 'Green Spinach', sales: 156, revenue: 15600 },
              { name: 'Red Tomatoes', sales: 143, revenue: 14300 },
              { name: 'Fresh Carrots', sales: 128, revenue: 12800 }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} units sold</p>
                </div>
                <p className="font-semibold text-green-600">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order received', details: 'Order #1234 - ₹450', time: '2 minutes ago' },
            { action: 'Product added', details: 'Fresh Mangoes added to inventory', time: '15 minutes ago' },
            { action: 'Customer registered', details: 'New customer: Priya Sharma', time: '1 hour ago' },
            { action: 'Review submitted', details: '5-star review for Organic Apples', time: '2 hours ago' },
            { action: 'Stock alert', details: 'Low stock: Green Spinach (5 units left)', time: '3 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}