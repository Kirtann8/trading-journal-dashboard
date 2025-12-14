'use client'

import { useState, memo, useCallback } from 'react'
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatDate } from '../lib/dashboard-utils'
import { deleteTrade } from '../lib/api/trades'
import { Card, Badge, Button, Modal } from '@/components/ui'

const TradesTable = memo(function TradesTable({ trades, onUpdate }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, tradeId: null, tradeName: '' })
  const [deleting, setDeleting] = useState(false)

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUpIcon className="h-4 w-4 text-muted-foreground/30" />
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-primary" />
    )
  }, [sortConfig])

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

  const handleEdit = useCallback((trade) => {
    window.location.href = `/trades/${trade._id}/edit`
  }, [])

  const handleDeleteClick = useCallback((trade) => {
    setDeleteConfirm({
      show: true,
      tradeId: trade._id,
      tradeName: `${trade.symbol} ${trade.side.toUpperCase()}`
    })
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
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
  }, [deleteConfirm.tradeId, onUpdate])

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm({ show: false, tradeId: null, tradeName: '' })
  }, [])

  const TableHeader = memo(({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors group"
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">
          {getSortIcon(sortKey)}
        </span>
      </div>
    </th>
  ))
  TableHeader.displayName = 'TableHeader'

  return (
    <>
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border/50">
              <tr>
                <TableHeader label="Symbol" sortKey="symbol" />
                <TableHeader label="Side" sortKey="side" />
                <TableHeader label="Entry Price" sortKey="entryPrice" />
                <TableHeader label="Exit Price" sortKey="exitPrice" />
                <TableHeader label="Quantity" sortKey="quantity" />
                <TableHeader label="P&L" sortKey="pnl" />
                <TableHeader label="Date" sortKey="createdAt" />
                <TableHeader label="Status" sortKey="status" />
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortedTrades.map((trade, index) => (
                <tr
                  key={trade._id}
                  className="hover:bg-secondary/20 transition-colors group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-foreground">
                      {trade.symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={trade.side === 'buy' ? 'success' : 'danger'}
                      dot
                    >
                      {trade.side.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                    {trade.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold font-mono ${getPnLColor(trade.profitLoss)}`}>
                      {formatCurrency(trade.profitLoss || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(trade.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={trade.status === 'open' ? 'primary' : 'default'}
                    >
                      {trade.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(trade)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        title="Edit trade"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(trade)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
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
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.show}
        onClose={handleDeleteCancel}
        title="Delete Trade"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete the trade:
          </p>
          <p className="text-lg font-bold text-foreground">
            {deleteConfirm.tradeName}
          </p>
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-sm font-medium">
              ⚠️ This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={handleDeleteCancel}
              disabled={deleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              isLoading={deleting}
              className="flex-1"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default TradesTable