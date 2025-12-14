'use client'

import { memo, useState } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

const sizes = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
}

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
  away: 'bg-warning',
}

const Avatar = memo(({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false)
  
  const getInitials = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getColorClass = (name) => {
    if (!name) return 'from-primary to-accent'
    const colors = [
      'from-primary to-accent',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-cyan-500 to-blue-500',
      'from-violet-500 to-purple-500',
      'from-rose-500 to-pink-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      <div className={`
        ${sizes[size]} 
        rounded-full overflow-hidden flex items-center justify-center
        ring-2 ring-border
        ${!src || imageError ? `bg-gradient-to-br ${getColorClass(name)}` : ''}
      `}>
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : name ? (
          <span className="font-semibold text-white">{getInitials(name)}</span>
        ) : (
          <UserIcon className="w-1/2 h-1/2 text-white" />
        )}
      </div>
      
      {status && (
        <span className={`
          absolute bottom-0 right-0 
          ${statusSizes[size]} 
          ${statusColors[status] || 'bg-muted-foreground'}
          rounded-full ring-2 ring-background
        `} />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar
