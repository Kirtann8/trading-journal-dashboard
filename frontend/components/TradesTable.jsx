'use client'

import { useState } from 'react'
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatDate } from '../lib/dashboard-utils'
import { deleteTrade } from '../lib/api/trades'

export default function TradesTable({ trades, onUpdate }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, tradeId: null, tradeName: '' })
  const [deleting, setDeleting] = useState(false)

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUpIcon className="h-4 w-4 text-muted-foreground/50" />
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-primary" />
    )
  }

  const sortedTrades = [...trades].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-success'
    if (pnl < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  const handleEdit = (trade) => {
    window.location.href = `/trades/${trade._id}/edit`
  }

  const handleDeleteClick = (trade) => {
    setDeleteConfirm({
      show: true,
      tradeId: trade._id,
      tradeName: `${trade.symbol} ${trade.side.toUpperCase()}`
    })
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      const result = await deleteTrade(deleteConfirm.tradeId)
      if (result.success) {
        setDeleteConfirm({ show: false, tradeId: null, tradeName: '' })
        if (onUpdate) onUpdate()
      } else {
        alert('Failed to delete trade: ' + result.error)
      }
    } catch (error) {
      alert('Error deleting trade: ' + error.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, tradeId: null, tradeName: '' })
  }

  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border/50">
              <tr>
                <th
                  onClick={() => handleSort('symbol')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    {getSortIcon('symbol')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('side')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Side</span>
                    {getSortIcon('side')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('entryPrice')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Entry Price</span>
                    {getSortIcon('entryPrice')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('exitPrice')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Exit Price</span>
                    {getSortIcon('exitPrice')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('quantity')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    {getSortIcon('quantity')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pnl')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>PnL</span>
                    {getSortIcon('pnl')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedTrades.map((trade, index) => (
                <tr
                  key={trade._id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {trade.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trade.side === 'buy'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                      }`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {trade.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={getPnLColor(trade.profitLoss)}>
                      {formatCurrency(trade.profitLoss || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(trade.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trade.status === 'open'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-muted-foreground'
                      }`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(trade)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Edit trade"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(trade)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        title="Delete trade"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal - Rendered at root level */}
      {deleteConfirm.show && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-[99999] flex items-center justify-center p-4"
          onClick={handleDeleteCancel}
        >
          <div
            className="relative bg-card border-2 border-destructive/50 w-full max-w-md shadow-2xl rounded-xl p-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">⚠️ Delete Trade</h3>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              Are you sure you want to delete the trade:
            </p>
            <p className="text-lg font-bold text-foreground mb-4">
              {deleteConfirm.tradeName}
            </p>
            <p className="text-destructive font-medium mb-6">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-4 py-3 border-2 border-border bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-destructive hover:bg-destructive/90 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-destructive/30"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}