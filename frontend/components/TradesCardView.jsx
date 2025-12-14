'use client'

import { PencilIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatDate } from '../lib/dashboard-utils'

export default function TradesCardView({ trades, onUpdate }) {
  const getSideColor = (side) => {
    return side === 'buy' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status) => {
    return status === 'open' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
  }

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-green-600'
    if (pnl < 0) return 'text-red-600'
    return 'text-gray-900'
  }

  const handleEdit = (trade) => {
    window.location.href = `/trades/${trade._id}/edit`
  }

  const handleDelete = (tradeId) => {
    // TODO: Implement delete functionality
    console.log('Delete trade:', tradeId)
  }

  return (
    <div className="grid-responsive">
      {trades.map((trade) => (
        <div
          key={trade._id}
          className="card hover:shadow-lg transition-all duration-200 animate-fade-in"
        >
          <div className="card-body">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-responsive-lg font-semibold text-gray-900">{trade.symbol}</h3>
                <span className={`badge ${trade.side === 'buy' ? 'badge-success' : 'badge-danger'}`}>
                  {trade.side.toUpperCase()}
                </span>
              </div>
              <span className={`badge ${trade.status === 'open' ? 'badge-primary' : 'badge-gray'}`}>
                {trade.status.toUpperCase()}
              </span>
            </div>

            {/* Price Flow */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">Entry Price</p>
                <p className="text-responsive-sm font-medium text-gray-900">
                  {formatCurrency(trade.entryPrice)}
                </p>
              </div>
              
              <ArrowRightIcon className="h-4 w-4 text-gray-400 mx-2" />
              
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">Exit Price</p>
                <p className="text-responsive-sm font-medium text-gray-900">
                  {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Quantity</p>
              <p className="text-responsive-sm font-medium text-gray-900">{trade.quantity}</p>
            </div>

            {/* PnL */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Profit/Loss</p>
              <p className={`text-responsive-2xl font-bold ${getPnLColor(trade.pnl)}`}>
                {formatCurrency(trade.pnl || 0)}
              </p>
            </div>

            {/* Strategy & Date */}
            <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
              <span className="truncate mr-2">{trade.strategy || 'No strategy'}</span>
              <span className="whitespace-nowrap">{formatDate(trade.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(trade)}
                className="btn-ghost btn-sm text-primary-600 hover:text-primary-800 min-h-touch"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(trade._id)}
                className="btn-ghost btn-sm text-danger-600 hover:text-danger-800 min-h-touch"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}