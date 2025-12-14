'use client'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  centered = false, 
  overlay = false,
  text = null 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4'
      case 'lg': return 'h-8 w-8'
      case 'xl': return 'h-12 w-12'
      case 'md':
      default: return 'h-6 w-6'
    }
  }

  const getColorClass = () => {
    switch (color) {
      case 'white': return 'border-white border-t-transparent'
      case 'success': return 'border-success-200 border-t-success-600'
      case 'danger': return 'border-danger-200 border-t-danger-600'
      case 'warning': return 'border-warning-200 border-t-warning-600'
      case 'primary':
      default: return 'border-primary-200 border-t-primary-600'
    }
  }

  const spinner = (
    <div className="flex flex-col items-center space-y-2">
      <div className={`spinner ${getSizeClass()} ${getColorClass()}`} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
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
}

export default LoadingSpinner