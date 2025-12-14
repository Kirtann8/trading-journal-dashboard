'use client'

import { useEffect, memo, useCallback } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

const Toast = memo(function Toast({ toast, onRemove }) {
  const { id, message, type, duration } = toast

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onRemove])

  const handleRemove = useCallback(() => {
    onRemove(id)
  }, [id, onRemove])

  const toastConfig = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
      glow: 'shadow-glow-success',
      icon: CheckCircleIcon,
    },
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      text: 'text-destructive',
      glow: 'shadow-glow-destructive',
      icon: ExclamationCircleIcon,
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
      glow: 'shadow-glow-warning',
      icon: ExclamationTriangleIcon,
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      text: 'text-primary',
      glow: 'shadow-glow',
      icon: InformationCircleIcon,
    },
  }

  const config = toastConfig[type] || toastConfig.info
  const IconComponent = config.icon

  return (
    <div 
      className={`
        max-w-sm w-full rounded-xl border backdrop-blur-xl
        ${config.bg} ${config.border}
        shadow-elevated ${config.glow}
        animate-scale-in
        transition-all duration-200
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-1.5 rounded-lg ${config.bg}`}>
            <IconComponent className={`h-5 w-5 ${config.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="h-1 w-full bg-secondary/30 rounded-b-xl overflow-hidden">
          <div 
            className={`h-full ${config.text.replace('text-', 'bg-')} animate-shrink-width`}
            style={{ 
              animationDuration: `${duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          />
        </div>
      )}
    </div>
  )
})

const ToastContainer = memo(function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
})

export default ToastContainer
export { Toast }