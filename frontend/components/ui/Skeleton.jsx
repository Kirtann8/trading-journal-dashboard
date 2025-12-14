'use client'

import { memo } from 'react'

const Skeleton = memo(({
  className = '',
  variant = 'text',
  width,
  height,
  rounded = 'lg',
}) => {
  const variants = {
    text: 'h-4',
    title: 'h-6',
    avatar: 'w-10 h-10 rounded-full',
    thumbnail: 'w-16 h-16',
    card: 'w-full h-32',
    button: 'w-24 h-10',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`
        bg-secondary/50 shimmer
        ${variants[variant] || ''}
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  )
})

Skeleton.displayName = 'Skeleton'

// Preset skeleton components
const SkeletonCard = memo(({ className = '' }) => (
  <div className={`card p-6 space-y-4 ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
    <Skeleton variant="text" className="w-full" />
    <Skeleton variant="text" className="w-4/5" />
    <Skeleton variant="text" className="w-3/5" />
  </div>
))
SkeletonCard.displayName = 'SkeletonCard'

const SkeletonTable = memo(({ rows = 5 }) => (
  <div className="space-y-3">
    <div className="flex gap-4 p-4 bg-secondary/30 rounded-xl">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4">
        {[...Array(4)].map((_, j) => (
          <Skeleton key={j} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
))
SkeletonTable.displayName = 'SkeletonTable'

const SkeletonStats = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="avatar" rounded="xl" className="w-12 h-12" />
          <Skeleton variant="text" className="w-16" />
        </div>
        <Skeleton variant="title" className="w-2/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    ))}
  </div>
))
SkeletonStats.displayName = 'SkeletonStats'

export default Skeleton
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats }
