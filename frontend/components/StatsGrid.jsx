'use client'

import { memo } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ScaleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { formatCurrency, formatPercentage, formatRatio, getPnLColor, getTrendDirection } from '../lib/dashboard-utils'
import StatCard from '@/components/ui/StatCard'

const StatsGrid = memo(function StatsGrid({ stats }) {
  if (!stats) return null

  const getTrendType = (current, previous) => {
    const direction = getTrendDirection(current, previous)
    if (direction === 'up') return 'positive'
    if (direction === 'down') return 'negative'
    return 'neutral'
  }

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null
    const change = ((current - previous) / Math.abs(previous)) * 100
    return Math.abs(change).toFixed(1)
  }

  const statCards = [
    {
      title: 'Total Trades',
      value: stats.totalTrades || 0,
      icon: ChartBarIcon,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      change: calculateChange(stats.totalTrades, stats.previousTotalTrades),
      changeType: getTrendType(stats.totalTrades, stats.previousTotalTrades),
      description: 'all time'
    },
    {
      title: 'Open Trades',
      value: stats.openTrades || 0,
      icon: ClockIcon,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      change: calculateChange(stats.openTrades, stats.previousOpenTrades),
      changeType: getTrendType(stats.openTrades, stats.previousOpenTrades),
      description: 'active positions'
    },
    {
      title: 'Closed Trades',
      value: stats.closedTrades || 0,
      icon: ChartBarIcon,
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400',
      change: calculateChange(stats.closedTrades, stats.previousClosedTrades),
      changeType: getTrendType(stats.closedTrades, stats.previousClosedTrades),
      description: 'completed'
    },
    {
      title: 'Win Rate',
      value: formatPercentage(stats.winRate),
      icon: TrendingUpIcon,
      iconBg: stats.winRate >= 50 ? 'bg-success/15' : 'bg-destructive/15',
      iconColor: stats.winRate >= 50 ? 'text-success' : 'text-destructive',
      change: calculateChange(stats.winRate, stats.previousWinRate),
      changeType: getTrendType(stats.winRate, stats.previousWinRate),
      description: 'vs last period'
    },
    {
      title: 'Total P&L',
      value: formatCurrency(stats.totalPnL),
      icon: CurrencyDollarIcon,
      iconBg: stats.totalPnL >= 0 ? 'bg-success/15' : 'bg-destructive/15',
      iconColor: stats.totalPnL >= 0 ? 'text-success' : 'text-destructive',
      change: calculateChange(stats.totalPnL, stats.previousTotalPnL),
      changeType: getTrendType(stats.totalPnL, stats.previousTotalPnL),
      description: 'total profit/loss'
    },
    {
      title: 'Average R:R',
      value: formatRatio(stats.avgRR),
      icon: ScaleIcon,
      iconBg: 'bg-orange-500/15',
      iconColor: 'text-orange-400',
      change: calculateChange(stats.avgRR, stats.previousAvgRR),
      changeType: getTrendType(stats.avgRR, stats.previousAvgRR),
      description: 'risk/reward ratio'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Trading Statistics</h2>
        <span className="text-sm text-muted-foreground">Last 30 days</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={stat.title}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  )
})

export default StatsGrid