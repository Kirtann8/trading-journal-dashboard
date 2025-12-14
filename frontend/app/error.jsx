'use client'

import { useEffect } from 'react'
import { ServerError } from '../components/ErrorFallback'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ServerError
        title="Something Went Wrong"
        message="An unexpected error occurred. Please try again."
        onRetry={reset}
      />
    </div>
  )
}