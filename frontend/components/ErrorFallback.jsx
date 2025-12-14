'use client'

import { 
  ExclamationTriangleIcon, 
  HomeIcon, 
  ArrowPathIcon,
  WifiIcon,
  LockClosedIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ErrorFallback = ({ 
  type = '500', 
  title, 
  message, 
  onRetry, 
  showHomeButton = true,
  className = '' 
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case '404':
        return {
          icon: MagnifyingGlassIcon,
          title: title || 'Page Not Found',
          message: message || 'The page you are looking for does not exist.',
          iconColor: 'text-gray-400'
        }
      
      case '403':
        return {
          icon: LockClosedIcon,
          title: title || 'Access Denied',
          message: message || 'You do not have permission to access this resource.',
          iconColor: 'text-warning-500'
        }
      
      case 'network':
        return {
          icon: WifiIcon,
          title: title || 'Connection Error',
          message: message || 'Please check your internet connection and try again.',
          iconColor: 'text-danger-500'
        }
      
      case '500':
      default:
        return {
          icon: ExclamationTriangleIcon,
          title: title || 'Something Went Wrong',
          message: message || 'An unexpected error occurred. Please try again.',
          iconColor: 'text-danger-500'
        }
    }
  }

  const config = getErrorConfig()
  const IconComponent = config.icon

  return (
    <div className={`min-h-96 flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <IconComponent className={`h-16 w-16 mx-auto mb-4 ${config.iconColor}`} />
        
        <h2 className="text-responsive-2xl font-bold text-gray-900 mb-2">
          {config.title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {config.message}
        </p>
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary w-full sm:w-auto"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Try Again
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-outline w-full sm:w-auto sm:ml-3"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Specific error components
export const NotFoundError = ({ title, message, onRetry }) => (
  <ErrorFallback 
    type="404" 
    title={title} 
    message={message} 
    onRetry={onRetry} 
  />
)

export const UnauthorizedError = ({ title, message, onRetry }) => (
  <ErrorFallback 
    type="403" 
    title={title} 
    message={message} 
    onRetry={onRetry} 
  />
)

export const NetworkError = ({ title, message, onRetry }) => (
  <ErrorFallback 
    type="network" 
    title={title} 
    message={message} 
    onRetry={onRetry} 
  />
)

export const ServerError = ({ title, message, onRetry }) => (
  <ErrorFallback 
    type="500" 
    title={title} 
    message={message} 
    onRetry={onRetry} 
  />
)

export default ErrorFallback