'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import TradeForm from '../../../../components/TradeForm'
import LoadingSkeleton from '../../../../components/LoadingSkeleton'
import { getTradeById, updateTrade, deleteTrade } from '../../../../lib/api/trades'

export default function EditTradePage() {
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notFound, setNotFound] = useState(false)

  const router = useRouter()
  const params = useParams()
  const tradeId = params.id

  useEffect(() => {
    fetchTrade()
  }, [tradeId])

  const fetchTrade = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getTradeById(tradeId)

      if (result.success) {
        setTrade(result.data)
      } else {
        if (result.error.includes('404') || result.error.includes('not found')) {
          setNotFound(true)
        } else {
          setError(result.error || 'Failed to fetch trade')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (tradeData) => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await updateTrade(tradeId, tradeData)

      if (result.success) {
        setSuccess('Trade updated successfully!')
        setTimeout(() => {
          router.push('/trades')
        }, 1500)
      } else {
        setError(result.error || 'Failed to update trade')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const result = await deleteTrade(tradeId)

      if (result.success) {
        setSuccess('Trade deleted successfully!')
        setTimeout(() => {
          router.push('/trades')
        }, 1500)
      } else {
        setError(result.error || 'Failed to delete trade')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 bg-secondary/50 rounded w-64 mb-2"></div>
          <div className="h-4 bg-secondary/50 rounded w-96"></div>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-12 glass-card rounded-xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Trade Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The trade you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
        </p>
        <button
          onClick={() => router.push('/trades')}
          className="btn-primary"
        >
          Back to Trades
        </button>
      </div>
    )
  }

  if (error && !trade) {
    return (
      <div className="text-center py-12 glass-card rounded-xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Trade</h1>
        <p className="text-destructive mb-6">{error}</p>
        <div className="space-x-4">
          <button
            onClick={fetchTrade}
            className="btn-primary"
          >
            Retry
          </button>
          <button
            onClick={() => router.push('/trades')}
            className="btn-outline"
          >
            Back to Trades
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Trade</h1>
        <p className="mt-2 text-muted-foreground">
          Update your trade details for <span className="text-primary font-semibold">{trade?.symbol}</span>
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
      {trade && (
        <TradeForm
          initialData={trade}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isLoading={isSubmitting}
          isEdit={true}
        />
      )}
    </div>
  )
}