'use client'

import AdminLayout from './AdminLayout'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/InventoryPage'
import PricingPage from './pages/PricingPage'
import CustomersPage from './pages/CustomersPage'
import ReviewsPage from './pages/ReviewsPage'
import AIInsightsPage from './pages/AIInsightsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import { useAdmin } from './AdminContext'

export default function AdminDashboard() {
  const { currentView } = useAdmin()

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard': return <DashboardPage />
      case 'Orders': return <OrdersPage />
      case 'Products': return <ProductsPage />
      case 'Inventory': return <InventoryPage />
      case 'Pricing & Offers': return <PricingPage />
      case 'Customers': return <CustomersPage />
      case 'Reviews': return <ReviewsPage />
      case 'AI Insights': return <AIInsightsPage />
      case 'Reports': return <ReportsPage />
      case 'Settings': return <SettingsPage />
      default: return <DashboardPage />
    }
  }

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  )
}