// Trade utility functions

export const validateTradeForm = (formData) => {
  const errors = {}

  // Symbol validation
  if (!formData.symbol?.trim()) {
    errors.symbol = 'Symbol is required'
  } else if (!/^[A-Z]{2,10}$/.test(formData.symbol.toUpperCase())) {
    errors.symbol = 'Symbol must be 2-10 uppercase letters'
  }

  // Entry price validation
  if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
    errors.entryPrice = 'Entry price must be greater than 0'
  }

  // Exit price validation (optional but must be > 0 if provided)
  if (formData.exitPrice && parseFloat(formData.exitPrice) <= 0) {
    errors.exitPrice = 'Exit price must be greater than 0'
  }

  // Quantity validation
  if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0'
  }

  // Date validation
  if (!formData.date) {
    errors.date = 'Date is required'
  } else if (new Date(formData.date) > new Date()) {
    errors.date = 'Date cannot be in the future'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const calculatePnL = (entryPrice, exitPrice, quantity, side) => {
  const entry = parseFloat(entryPrice)
  const exit = parseFloat(exitPrice)
  const qty = parseFloat(quantity)

  if (!entry || !exit || !qty) {
    return { amount: 0, percentage: 0 }
  }

  let pnlAmount
  if (side === 'buy') {
    pnlAmount = (exit - entry) * qty
  } else {
    pnlAmount = (entry - exit) * qty
  }
  
  const pnlPercentage = ((exit - entry) / entry) * 100 * (side === 'buy' ? 1 : -1)
  
  return {
    amount: pnlAmount,
    percentage: pnlPercentage
  }
}

export const formatTradeData = (formData) => {
  return {
    ...formData,
    symbol: formData.symbol.toUpperCase(),
    entryPrice: parseFloat(formData.entryPrice),
    exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
    quantity: parseFloat(formData.quantity),
    status: formData.exitPrice ? 'closed' : 'open'
  }
}

export const getCommonCryptoSymbols = () => {
  return [
    'BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'XRP', 'LTC', 'BCH', 
    'BNB', 'SOL', 'AVAX', 'MATIC', 'ATOM', 'ALGO', 'VET', 'FTM'
  ]
}

export const getTradeStrategies = () => {
  return [
    { value: 'scalping', label: 'Scalping' },
    { value: 'swing', label: 'Swing Trading' },
    { value: 'hodl', label: 'HODL' },
    { value: 'dca', label: 'DCA (Dollar Cost Average)' },
    { value: 'breakout', label: 'Breakout Trading' },
    { value: 'momentum', label: 'Momentum Trading' },
    { value: 'arbitrage', label: 'Arbitrage' }
  ]
}