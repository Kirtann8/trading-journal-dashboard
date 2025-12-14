'use client'

import { useState, useEffect, Suspense, memo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PlusIcon, ArrowPathIcon, TableCellsIcon, Squares2X2Icon, DocumentChartBarIcon } from '@heroicons/react/24/outline'
import TradeFilters from '../../components/TradeFilters'
import TradesTable from '../../components/TradesTable'
import TradesCardView from '../../components/TradesCardView'
import Pagination from '../../components/Pagination'
import ErrorFallback from '../../components/ErrorFallback'
import { useApp } from '../../context/AppContext'
import { getTrades } from '../../lib/api/trades'
import { recalculateTrades } from '../../lib/api/recalculate'
import { handleApiError } from '../../lib/errorHandler'
import { Card, Button, Badge } from '../../components/ui'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'

const TradesPageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
    <Card variant="glass" className="p-4">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </Card>
    <SkeletonTable rows={5} columns={8} />
  </div>
)

const EmptyState = memo(function EmptyState({ onCreateTrade }) {
  return (
    <Card variant="glass" className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <DocumentChartBarIcon className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No trades yet</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Start tracking your trading journey by logging your first trade. 
          Every successful trader keeps a detailed journal.
        </p>
        <Button onClick={onCreateTrade} size="lg">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Your First Trade
        </Button>
      </div>
    </Card>
  )
})

const ViewToggle = memo(function ViewToggle({ viewMode, onViewModeChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-lg">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          viewMode === 'table' 
            ? 'bg-primary text-white shadow-md' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <TableCellsIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          viewMode === 'cards' 
            ? 'bg-primary text-white shadow-md' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Squares2X2Icon className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </button>
    </div>
  )
})

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

  const fetchTrades = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getTrades(filters)

      if (result.success && result.data) {
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
  }, [filters, showError])

  const handleRecalculate = useCallback(async () => {
    setRecalculating(true)
    try {
      const result = await recalculateTrades()
      if (result.success) {
        handleSuccess('P&L recalculated successfully!')
        fetchTrades()
      } else {
        showError({ message: result.error || 'Failed to recalculate P&L' })
      }
    } catch (error) {
      showError({ message: 'Error recalculating P&L' })
    } finally {
      setRecalculating(false)
    }
  }, [fetchTrades, handleSuccess, showError])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  const handleFilterChange = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)

    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/trades?${params.toString()}`)
  }, [filters, router])

  const handlePageChange = useCallback((page) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)

    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/trades?${params.toString()}`)
  }, [filters, router])

  const handleTradeUpdate = useCallback(() => {
    fetchTrades()
  }, [fetchTrades])

  if (loading) {
    return <TradesPageSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Your Trades</h1>
            {totalCount > 0 && (
              <Badge variant="primary">{totalCount} total</Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage and track your trading activity</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button
            variant="secondary"
            onClick={handleRecalculate}
            isLoading={recalculating}
            disabled={recalculating || trades.length === 0}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${recalculating ? 'animate-spin' : ''}`} />
            Recalculate P&L
          </Button>
          <Button onClick={() => router.push('/trades/create')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
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
        <EmptyState onCreateTrade={() => router.push('/trades/create')} />
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
    <Suspense fallback={<TradesPageSkeleton />}>
      <TradesPageContent />
    </Suspense>
  )
}