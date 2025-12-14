'use client'

import { memo } from 'react'

const variants = {
  default: 'badge-neutral',
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  accent: 'badge-accent',
}

const Badge = memo(({
  className = '',
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const dotColors = {
    default: 'bg-muted-foreground',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
    accent: 'bg-accent',
  }

  return (
    <span className={`${variants[variant]} ${className}`} {...props}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
