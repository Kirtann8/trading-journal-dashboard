'use client'

import { NotFoundError } from '../components/ErrorFallback'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <NotFoundError
        title="Page Not Found"
        message="The page you are looking for does not exist or has been moved."
      />
    </div>
  )
}