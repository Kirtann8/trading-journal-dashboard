'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function TradeFilters({ filters, onFilterChange, totalCount }) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleInputChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
  }

  const resetFilters = () => {
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
  }

  const hasActiveFilters = Object.values(localFilters).some(value =>
    value && value !== 'latest' && value !== ''
  )

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">Filters</h3>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">({totalCount} results)</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Symbol Search */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Symbol
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search BTC, ETH..."
              value={localFilters.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Side Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Side
          </label>
          <select
            value={localFilters.side}
            onChange={(e) => handleInputChange('side', e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Strategy Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Strategy
          </label>
          <select
            value={localFilters.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            <option value="scalping">Scalping</option>
            <option value="swing">Swing Trading</option>
            <option value="hodl">HODL</option>
            <option value="dca">DCA</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="input-field"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Sort By
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="input-field"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="best_profit">Best Profit</option>
            <option value="worst_loss">Worst Loss</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          onClick={applyFilters}
          className="btn-primary"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}