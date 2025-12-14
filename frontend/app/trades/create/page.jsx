'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TradeForm from '../../../components/TradeForm'
import { createTrade } from '../../../lib/api/trades'

export default function CreateTradePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (tradeData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await createTrade(tradeData)

      if (result.success) {
        setSuccess('Trade created successfully!')
        setTimeout(() => {
          router.push('/trades')
        }, 1500)
      } else {
        setError(result.error || 'Failed to create trade')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Trade</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new trade to your journal with all the details
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Trade Form */}
      <TradeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEdit={false}
      />
    </div>
  )
}