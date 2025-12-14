'use client'

import { forwardRef, memo } from 'react'

const Card = forwardRef(({
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'card',
    glass: 'glass-card',
    subtle: 'glass-subtle rounded-2xl',
    elevated: 'card shadow-elevated',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      ref={ref}
      className={`${variants[variant]} ${paddings[padding]} ${hover ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

const CardHeader = memo(({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
))
CardHeader.displayName = 'CardHeader'

const CardTitle = memo(({ className = '', as: Tag = 'h3', children, ...props }) => (
  <Tag className={`text-lg font-semibold text-foreground ${className}`} {...props}>
    {children}
  </Tag>
))
CardTitle.displayName = 'CardTitle'

const CardDescription = memo(({ className = '', children, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
))
CardDescription.displayName = 'CardDescription'

const CardContent = memo(({ className = '', children, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
))
CardContent.displayName = 'CardContent'

const CardFooter = memo(({ className = '', children, ...props }) => (
  <div className={`flex items-center pt-4 mt-4 border-t border-border/50 ${className}`} {...props}>
    {children}
  </div>
))
CardFooter.displayName = 'CardFooter'

export default memo(Card)
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
