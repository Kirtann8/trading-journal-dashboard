'use client'

import { createContext, useContext, useState } from 'react'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false)
  const toast = useToast()

  const showGlobalLoading = (show = true) => {
    setGlobalLoading(show)
  }

  const handleError = (error, context = {}) => {
    console.error('App Error:', error, context)
    
    let message = 'An unexpected error occurred'
    
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      if (data?.message) {
        message = data.message
      } else if (typeof data === 'string') {
        message = data
      } else {
        switch (status) {
          case 400:
            message = 'Invalid request. Please check your input.'
            break
          case 401:
            message = 'Your session has expired. Please log in again.'
            break
          case 403:
            message = 'You do not have permission to perform this action.'
            break
          case 404:
            message = 'The requested resource was not found.'
            break
          case 500:
            message = 'Server error. Please try again later.'
            break
        }
      }
    } else if (error.message) {
      message = error.message
    }
    
    toast.error(message)
  }

  const handleSuccess = (message) => {
    toast.success(message)
  }

  const value = {
    // Loading state
    globalLoading,
    showGlobalLoading,
    
    // Toast notifications
    toast: {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      clearAll: toast.clearAll
    },
    
    // Error handling
    handleError,
    handleSuccess
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      
      {/* Global Loading Overlay */}
      {globalLoading && (
        <LoadingSpinner 
          overlay 
          size="lg" 
          text="Loading..." 
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer 
        toasts={toast.toasts} 
        onRemove={toast.removeToast} 
      />
    </AppContext.Provider>
  )
}

export default AppProvider