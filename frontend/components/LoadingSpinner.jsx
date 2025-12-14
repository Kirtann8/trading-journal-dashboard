'use client'

import { memo } from 'react'

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  centered = false, 
  overlay = false,
  text = null 
}) {
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-12 w-12 border-[3px]',
  }

  const colorClasses = {
    white: 'border-white/30 border-t-white',
    primary: 'border-primary/20 border-t-primary',
    success: 'border-success/20 border-t-success',
    destructive: 'border-destructive/20 border-t-destructive',
    warning: 'border-warning/20 border-t-warning',
    accent: 'border-accent/20 border-t-accent',
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={`
          rounded-full animate-spin
          ${sizeClasses[size] || sizeClasses.md}
          ${colorClasses[color] || colorClasses.primary}
        `} 
      />
      {text && (
        <p className={`${textSizes[size]} text-muted-foreground animate-pulse font-medium`}>
          {text}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-elevated">
          {spinner}
        </div>
      </div>
    )
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinner}
      </div>
    )
  }

  return spinner
})

export default LoadingSpinner