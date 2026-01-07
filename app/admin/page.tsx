'use client'

import { AdminProvider } from '@/components/admin/AdminContext'
import { IndianCurrencyProvider } from '@/components/admin/IndianCurrencyContext'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  return (
    <AdminProvider>
      <IndianCurrencyProvider>
        <AdminDashboard />
      </IndianCurrencyProvider>
    </AdminProvider>
  )
}