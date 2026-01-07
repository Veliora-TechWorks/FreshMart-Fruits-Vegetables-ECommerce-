'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminContextType {
  currentView: string
  setCurrentView: (view: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AdminContext.Provider value={{ currentView, setCurrentView, sidebarOpen, setSidebarOpen }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdmin must be used within AdminProvider')
  return context
}