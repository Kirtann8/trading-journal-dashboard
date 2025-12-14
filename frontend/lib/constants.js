export const TRADE_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
}

export const TRADE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
}

export const CRYPTO_SYMBOLS = [
  'BTC',
  'ETH',
  'ADA',
  'DOT',
  'LINK',
  'XRP',
  'LTC',
  'BCH',
  'BNB',
  'SOL',
]

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  TRADES: {
    LIST: '/trades',
    CREATE: '/trades',
    UPDATE: (id) => `/trades/${id}`,
    DELETE: (id) => `/trades/${id}`,
  },
  PORTFOLIO: {
    GET: '/portfolio',
    STATS: '/portfolio/stats',
  },
}