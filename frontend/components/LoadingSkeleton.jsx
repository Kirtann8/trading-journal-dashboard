'use client'

import SkeletonLoader from './SkeletonLoader'

export default function LoadingSkeleton() {
  return (
    <div className="space-y-responsive">
      {/* Hero Section Skeleton */}
      <SkeletonLoader type="card" height="32" />
      
      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <SkeletonLoader type="card" height="80" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="lg:col-span-2">
          <SkeletonLoader type="stats" />
        </div>
      </div>
      
      {/* Quick Actions Skeleton */}
      <SkeletonLoader type="card" height="32" />
    </div>
  )
}