'use client'

import { useAuth } from '@/hooks/useAuth'
import Navbar from './Navbar'

export default function DashboardLayout({ children }) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container-custom py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}