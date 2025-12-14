'use client'

import { memo } from 'react'

const Layout = memo(function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 mesh-bg pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] orb-primary opacity-20 -translate-y-1/2 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] orb-accent opacity-15 translate-y-1/2 -translate-x-1/4" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
})

export default Layout