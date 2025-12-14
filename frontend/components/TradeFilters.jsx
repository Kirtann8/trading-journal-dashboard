'use client'

import { useState, memo, useCallback } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, CalendarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { Card, Button, Badge, Input } from '@/components/ui'

const TradeFilters = memo(function TradeFilters({ filters, onFilterChange, totalCount }) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleInputChange = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyFilters = useCallback(() => {
    onFilterChange(localFilters)
  }, [localFilters, onFilterChange])

  const resetFilters = useCallback(() => {
    const resetFilters = {
      symbol: '',
      side: '',
      status: '',
      strategy: '',
      startDate: '',
      endDate: '',
      sortBy: 'latest'
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }, [onFilterChange])

  const hasActiveFilters = Object.values(localFilters).some(value =>
    value && value !== 'latest' && value !== ''
  )

  const activeFilterCount = Object.values(localFilters).filter(value =>
    value && value !== 'latest' && value !== ''
  ).length

  return (
    <Card variant="glass" className="overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FunnelIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Filters</h3>
            {totalCount > 0 && (
              <span className="text-xs text-muted-foreground">{totalCount} trades found</span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Badge variant="primary" dot>
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetFilters()
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Reset</span>
            </button>
          )}
          <AdjustmentsHorizontalIcon className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`transition-all duration-300 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pb-4 space-y-4">
          {/* First Row - Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Symbol Search */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                Symbol
              </label>
              <Input
                type="text"
                placeholder="Search BTC, ETH..."
                value={localFilters.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>

            {/* Side Filter */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                Side
              </label>
              <select
                value={localFilters.side}
                onChange={(e) => handleInputChange('side', e.target.value)}
                className="input-field h-11"
              >
                <option value="">All Sides</option>
                <option value="buy">🟢 Buy / Long</option>
                <option value="sell">🔴 Sell / Short</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input-field h-11"
              >
                <option value="">All Status</option>
                <option value="open">⏳ Open</option>
                <option value="closed">✅ Closed</option>
              </select>
            </div>

            {/* Strategy Filter */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                Strategy
              </label>
              <select
                value={localFilters.strategy}
                onChange={(e) => handleInputChange('strategy', e.target.value)}
                className="input-field h-11"
              >
                <option value="">All Strategies</option>
                <option value="scalping">⚡ Scalping</option>
                <option value="swing">📊 Swing Trading</option>
                <option value="hodl">💎 HODL</option>
                <option value="dca">📈 DCA</option>
              </select>
            </div>
          </div>

          {/* Second Row - Date & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                From Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="input-field pl-10 h-11"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                To Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="input-field pl-10 h-11"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-muted-foreground">
                Sort By
              </label>
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
                className="input-field h-11"
              >
                <option value="latest">🕐 Latest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="best_profit">📈 Best Profit</option>
                <option value="worst_loss">📉 Worst Loss</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-border/30">
            <Button onClick={applyFilters} variant="primary">
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
})

export default TradeFilters