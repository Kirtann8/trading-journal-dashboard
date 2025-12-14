'use client'

import { useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { calculatePnL, getCommonCryptoSymbols, getTradeStrategies } from '../lib/trade-utils'

export default function TradeForm({
  initialData = null,
  onSubmit,
  onDelete = null,
  isLoading = false,
  isEdit = false
}) {
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'buy',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    strategy: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [pnl, setPnl] = useState({ amount: 0, percentage: 0 })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSymbolSuggestions, setShowSymbolSuggestions] = useState(false)
  const [filteredSymbols, setFilteredSymbols] = useState([])

  useEffect(() => {
    if (initialData) {
      setFormData({
        symbol: initialData.symbol || '',
        side: initialData.side || 'buy',
        entryPrice: initialData.entryPrice || '',
        exitPrice: initialData.exitPrice || '',
        quantity: initialData.quantity || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        strategy: initialData.strategy || '',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  useEffect(() => {
    const pnlResult = calculatePnL(formData.entryPrice, formData.exitPrice, formData.quantity, formData.side)
    setPnl(pnlResult)
  }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.side])

  useEffect(() => {
    const symbols = getCommonCryptoSymbols()
    const filtered = symbols.filter(symbol =>
      symbol.toLowerCase().includes(formData.symbol.toLowerCase())
    )
    setFilteredSymbols(filtered)
  }, [formData.symbol])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required'
    } else if (!/^[A-Z]{2,10}$/.test(formData.symbol.toUpperCase())) {
      newErrors.symbol = 'Symbol must be 2-10 uppercase letters'
    }

    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      newErrors.entryPrice = 'Entry price must be greater than 0'
    }

    if (formData.exitPrice && parseFloat(formData.exitPrice) <= 0) {
      newErrors.exitPrice = 'Exit price must be greater than 0'
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = {
      ...formData,
      symbol: formData.symbol.toUpperCase(),
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
      quantity: parseFloat(formData.quantity),
      status: formData.exitPrice ? 'closed' : 'open',
      pnl: formData.exitPrice ? pnl.amount : null
    }

    onSubmit(submitData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    if (field === 'symbol') {
      setShowSymbolSuggestions(value.length > 0)
    }
  }

  const handleSymbolSelect = (symbol) => {
    setFormData(prev => ({ ...prev, symbol }))
    setShowSymbolSuggestions(false)
    if (errors.symbol) {
      setErrors(prev => ({ ...prev, symbol: '' }))
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setShowDeleteConfirm(false)
    }
  }

  const getPnLColor = () => {
    if (pnl.amount > 0) return 'text-success'
    if (pnl.amount < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Symbol */}
            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Symbol *
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                onFocus={() => setShowSymbolSuggestions(formData.symbol.length > 0)}
                onBlur={() => setTimeout(() => setShowSymbolSuggestions(false), 200)}
                placeholder="BTC, ETH, ADA..."
                className={`input-field ${errors.symbol ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {showSymbolSuggestions && filteredSymbols.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto animate-fade-in">
                  {filteredSymbols.slice(0, 8).map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleSymbolSelect(symbol)}
                      className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}
              {errors.symbol && <p className="text-destructive text-sm mt-1">{errors.symbol}</p>}
            </div>

            {/* Side */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Side *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="buy"
                    checked={formData.side === 'buy'}
                    onChange={(e) => handleChange('side', e.target.value)}
                    className="mr-2 text-success focus:ring-success"
                  />
                  <span className={`font-medium ${formData.side === 'buy' ? 'text-success' : 'text-muted-foreground'}`}>Buy</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="sell"
                    checked={formData.side === 'sell'}
                    onChange={(e) => handleChange('side', e.target.value)}
                    className="mr-2 text-destructive focus:ring-destructive"
                  />
                  <span className={`font-medium ${formData.side === 'sell' ? 'text-destructive' : 'text-muted-foreground'}`}>Sell</span>
                </label>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.entryPrice}
                onChange={(e) => handleChange('entryPrice', e.target.value)}
                placeholder="0.00"
                className={`input-field ${errors.entryPrice ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {errors.entryPrice && <p className="text-destructive text-sm mt-1">{errors.entryPrice}</p>}
            </div>

            {/* Exit Price */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Exit Price
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.exitPrice}
                onChange={(e) => handleChange('exitPrice', e.target.value)}
                placeholder="0.00 (optional)"
                className={`input-field ${errors.exitPrice ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {errors.exitPrice && <p className="text-destructive text-sm mt-1">{errors.exitPrice}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Quantity *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0.00"
                className={`input-field ${errors.quantity ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`input-field ${errors.date ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Strategy
              </label>
              <select
                value={formData.strategy}
                onChange={(e) => handleChange('strategy', e.target.value)}
                className="input-field"
              >
                <option value="">Select strategy (optional)</option>
                {getTradeStrategies().map((strategy) => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PnL Display */}
            {formData.exitPrice && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Calculated PnL
                </label>
                <div className="p-3 bg-secondary/50 rounded-md border border-border/50">
                  <div className={`text-lg font-bold ${getPnLColor()}`}>
                    ${pnl.amount.toFixed(2)}
                  </div>
                  <div className={`text-sm ${getPnLColor()}`}>
                    {pnl.percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any notes about this trade..."
              rows={3}
              className="input-field min-h-[100px] py-3"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t border-border/50">
            <div>
              {isEdit && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-ghost text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  <span>Delete Trade</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Saving...' : (isEdit ? 'Update Trade' : 'Create Trade')}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 border border-border w-96 shadow-xl rounded-xl bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Delete Trade</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this trade? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}