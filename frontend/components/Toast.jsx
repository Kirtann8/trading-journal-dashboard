'use client'

import { useEffect } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

const Toast = ({ toast, onRemove }) => {
  const { id, message, type, duration } = toast

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onRemove])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800'
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800'
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      case 'info':
      default:
        return 'bg-primary-50 border-primary-200 text-primary-800'
    }
  }

  const getIcon = () => {
    const iconClass = 'h-5 w-5 flex-shrink-0'
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-success-500`} />
      case 'error':
        return <ExclamationCircleIcon className={`${iconClass} text-danger-500`} />
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-warning-500`} />
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconClass} text-primary-500`} />
    }
  }

  return (
    <div className={`max-w-sm w-full border rounded-lg shadow-lg animate-slide-up ${getToastStyles()}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onRemove(id)}
              className="inline-flex text-gray-400 hover:text-gray-600 focus-ring rounded-md"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export default ToastContainer
export { Toast }