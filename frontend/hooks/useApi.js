import { useState } from 'react'
import apiClient from '@/lib/api/client'

export const useApi = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (url, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient({
        url,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        ...options,
      })
      
      setData(response.data)
      return { success: true, data: response.data, error: null }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      return { success: false, data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    fetchData,
    reset,
  }
}