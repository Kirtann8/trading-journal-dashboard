'use client'

import { forwardRef, memo, useState } from 'react'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const Input = forwardRef(({
  className = '',
  type = 'text',
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const stateClasses = error
    ? 'border-destructive/50 focus:ring-destructive/30 focus:border-destructive/50'
    : success
      ? 'border-success/50 focus:ring-success/30 focus:border-success/50'
      : ''

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            input-field
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon || isPassword || error || success ? 'pr-11' : ''}
            ${stateClasses}
            ${className}
          `}
          {...props}
        />
        
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {error && <ExclamationCircleIcon className="w-5 h-5 text-destructive" />}
          {success && !error && <CheckCircleIcon className="w-5 h-5 text-success" />}
          {isPassword && !error && !success && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && !error && !success && rightIcon}
        </span>
      </div>
      
      {(error || hint) && (
        <p className={`mt-2 text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default memo(Input)
