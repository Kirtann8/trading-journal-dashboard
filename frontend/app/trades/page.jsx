'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TradeFilters from '../../components/TradeFilters'
import TradesTable from '../../components/TradesTable'
import TradesCardView from '../../components/TradesCardView'
import Pagination from '../../components/Pagination'
import SkeletonLoader from '../../components/SkeletonLoader'
import ErrorFallback from '../../components/ErrorFallback'
import { useApp } from '../../context/AppContext'
import { getTrades } from '../../lib/api/trades'
import { recalculateTrades } from '../../lib/api/recalculate'
import { handleApiError } from '../../lib/errorHandler'

function TradesPageContent() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recalculating, setRecalculating] = useState(false)

  const { handleError: showError, handleSuccess } = useApp()
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState('table')

  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState({
    symbol: searchParams.get('symbol') || '',
    side: searchParams.get('side') || '',
    status: searchParams.get('status') || '',
    strategy: searchParams.get('strategy') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortBy: searchParams.get('sortBy') || 'latest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 20
  })

  const fetchTrades = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getTrades(filters)

      if (result.success && result.data) {
        // Handle pagination data structure
        const tradesData = result.data.trades || result.data || []
        const paginationData = result.data.pagination || {}

        setTrades(Array.isArray(tradesData) ? tradesData : [])
        setTotalPages(Number(paginationData.totalPages) || 1)
        setTotalCount(Number(paginationData.totalCount) || 0)
      } else {
        setError(result.error || 'Failed to fetch trades')
        setTrades([])
        setTotalPages(1)
        setTotalCount(0)
      }
    } catch (err) {
      const appError = handleApiError(err, { action: 'fetchTrades', filters })
      setError(appError.message)
      showError(appError)
      setTrades([])
      setTotalPages(1)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const result = await recalculateTrades()
      if (result.success) {
        handleSuccess('P&L recalculated successfully!')
        fetchTrades() // Refresh the trades list
      } else {
        showError({ message: result.error || 'Failed to recalculate P&L' })
      }
    } catch (error) {
      showError({ message: 'Error recalculating P&L' })
    } finally {
      setRecalculating(false)
    }
  }

  useEffect(() => {
    fetchTrades()
  }, [filters])

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)

    // Update URL params
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/trades?${params.toString()}`)
  }

  const handlePageChange = (page) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)

    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/trades?${params.toString()}`)
  }

  const handleTradeUpdate = () => {
    fetchTrades()
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-secondary/50 rounded-xl"></div>
        <div className="h-64 bg-secondary/50 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Trades</h1>
          <p className="text-muted-foreground mt-1">Manage and track your trading activity</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => router.push('/trades/create')}
            className="btn-primary"
          >
            Add Trade
          </button>
        </div>
      </div>

      {/* Filters */}
      <TradeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
      />

      {/* Error State */}
      {error && (
        <ErrorFallback
          type="500"
          title="Failed to Load Trades"
          message={error}
          onRetry={fetchTrades}
          showHomeButton={false}
        />
      )}

      {/* Empty State */}
      {!loading && !error && Array.isArray(trades) && trades.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No trades found</h3>
          <p className="text-muted-foreground mb-6">Start your journey by logging your first trade.</p>
          <button
            onClick={() => router.push('/trades/create')}
            className="btn-primary"
          >
            Create Your First Trade
          </button>
        </div>
      )}

      {/* Trades Display */}
      {!loading && !error && Array.isArray(trades) && trades.length > 0 && (
        <>
          {viewMode === 'table' ? (
            <TradesTable trades={trades} onUpdate={handleTradeUpdate} />
          ) : (
            <TradesCardView trades={trades} onUpdate={handleTradeUpdate} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalCount={totalCount}
            itemsPerPage={filters.limit}
            onPageChange={handlePageChange}
            onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
          />
        </>
      )}
    </div>
  )
}

export default function TradesPage() {
  return (
    <Suspense fallback={<div className="space-y-8 animate-pulse">
      <div className="h-32 bg-secondary/50 rounded-xl"></div>
      <div className="h-64 bg-secondary/50 rounded-xl"></div>
    </div>}>
      <TradesPageContent />
    </Suspense>
  )
}