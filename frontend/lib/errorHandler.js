// Error handling utilities

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'UNKNOWN_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'AppError'
  }
}

export const parseApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      statusCode: 0,
      code: 'NETWORK_ERROR'
    }
  }

  const { status, data } = error.response
  
  // Parse error message from response
  let message = 'An unexpected error occurred'
  let code = 'UNKNOWN_ERROR'

  if (data) {
    if (typeof data === 'string') {
      message = data
    } else if (data.message) {
      message = data.message
    } else if (data.error) {
      message = data.error
    } else if (data.errors && Array.isArray(data.errors)) {
      message = data.errors.map(err => err.message || err).join(', ')
    }
    
    code = data.code || code
  }

  // Handle specific status codes
  switch (status) {
    case 400:
      return {
        message: message || 'Invalid request. Please check your input.',
        statusCode: 400,
        code: code || 'VALIDATION_ERROR'
      }
    
    case 401:
      return {
        message: 'Your session has expired. Please log in again.',
        statusCode: 401,
        code: 'AUTHENTICATION_ERROR'
      }
    
    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        statusCode: 403,
        code: 'AUTHORIZATION_ERROR'
      }
    
    case 404:
      return {
        message: message || 'The requested resource was not found.',
        statusCode: 404,
        code: 'NOT_FOUND_ERROR'
      }
    
    case 409:
      return {
        message: message || 'This resource already exists.',
        statusCode: 409,
        code: 'CONFLICT_ERROR'
      }
    
    case 422:
      return {
        message: message || 'The provided data is invalid.',
        statusCode: 422,
        code: 'VALIDATION_ERROR'
      }
    
    case 429:
      return {
        message: 'Too many requests. Please try again later.',
        statusCode: 429,
        code: 'RATE_LIMIT_ERROR'
      }
    
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'Server error. Please try again later.',
        statusCode: status,
        code: 'SERVER_ERROR'
      }
    
    default:
      return {
        message,
        statusCode: status,
        code
      }
  }
}

export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
    timestamp: new Date().toISOString(),
    context
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo)
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService(errorInfo)
  }
}

export const handleApiError = (error, context = {}) => {
  const parsedError = parseApiError(error)
  const appError = new AppError(parsedError.message, parsedError.statusCode, parsedError.code)
  
  logError(appError, context)
  
  return appError
}

export const getErrorMessage = (error) => {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error.response) {
    const parsed = parseApiError(error)
    return parsed.message
  }
  
  return error.message || 'An unexpected error occurred'
}

export const isNetworkError = (error) => {
  return !error.response || error.code === 'NETWORK_ERROR'
}

export const isAuthError = (error) => {
  return error.statusCode === 401 || error.code === 'AUTHENTICATION_ERROR'
}

export const isValidationError = (error) => {
  return error.statusCode === 400 || error.statusCode === 422 || error.code === 'VALIDATION_ERROR'
}

export const isServerError = (error) => {
  return error.statusCode >= 500 || error.code === 'SERVER_ERROR'
}