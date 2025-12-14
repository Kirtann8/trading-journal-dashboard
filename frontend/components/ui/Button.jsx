'use client'

import { forwardRef, memo } from 'react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
  success: 'btn-success',
  accent: 'btn-accent',
}

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon',
}

const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
})

Button.displayName = 'Button'

export default memo(Button)
