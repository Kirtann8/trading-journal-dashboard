// Dashboard utility functions

export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)
}

export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`
}

export const formatNumber = (value, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value || 0)
}

export const formatRatio = (value, decimals = 2) => {
  return `${(value || 0).toFixed(decimals)}:1`
}

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options
  })
}

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

export const getRiskColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'low': return 'text-green-600 bg-green-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'high': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export const getExperienceColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return 'text-blue-600 bg-blue-100'
    case 'intermediate': return 'text-purple-600 bg-purple-100'
    case 'advanced': return 'text-indigo-600 bg-indigo-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export const getPnLColor = (value) => {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-900'
}

export const getTrendDirection = (current, previous) => {
  if (!previous || current === previous) return 'neutral'
  return current > previous ? 'up' : 'down'
}