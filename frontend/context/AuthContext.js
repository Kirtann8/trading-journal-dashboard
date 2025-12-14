'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { login as apiLogin, register as apiRegister, getCurrentUser, updateProfile as apiUpdateProfile } from '@/lib/api/auth'
import { saveToken, getToken, removeToken } from '@/lib/auth-storage'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUserFromStorage()
  }, [])

  const loadUserFromStorage = async () => {
    try {
      const token = getToken()
      if (token) {
        const { success, data } = await getCurrentUser()
        if (success && data) {
          // getCurrentUser returns user data directly, not wrapped in { user: ... }
          setUser(data.user || data)
          setIsAuthenticated(true)
        } else {
          removeToken()
        }
      }
    } catch (err) {
      removeToken()
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password, username, firstName, lastName) => {
    setIsLoading(true)
    setError(null)
    
    const { success, data, error: apiError } = await apiRegister(email, password, username, firstName, lastName)
    
    if (success) {
      setUser(data.user)
      setIsAuthenticated(true)
    } else {
      setError(apiError)
    }
    
    setIsLoading(false)
    return { success, error: apiError }
  }

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    const { success, data, error: apiError } = await apiLogin(email, password)
    
    console.log('Login response:', { success, data, apiError })
    
    if (success && data) {
      setUser(data.user)
      setIsAuthenticated(true)
    } else {
      setError(apiError || 'Login failed')
    }
    
    setIsLoading(false)
    return { success, error: apiError }
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const updateProfile = async (data) => {
    setIsLoading(true)
    setError(null)
    
    const { success, data: updatedUser, error: apiError } = await apiUpdateProfile(data)
    
    if (success) {
      setUser(updatedUser.user)
    } else {
      setError(apiError)
    }
    
    setIsLoading(false)
    return { success, error: apiError }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext