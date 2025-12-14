'use client'

import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ScaleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { formatCurrency, formatPercentage, formatRatio, getPnLColor, getTrendDirection } from '../lib/dashboard-utils'

export default function StatsGrid({ stats }) {
  if (!stats) return null

  const getTrendIcon = (current, previous) => {
    const direction = getTrendDirection(current, previous)
    if (direction === 'neutral') return null
    return direction === 'up' ? (
      <TrendingUpIcon className="h-4 w-4 text-success" />
    ) : (
      <TrendingDownIcon className="h-4 w-4 text-destructive" />
    )
  }

  const statCards = [
    {
      label: 'Total Trades',
      value: stats.totalTrades || 0,
      icon: ChartBarIcon,
      color: 'bg-blue-500/10 text-blue-500',
      trend: getTrendIcon(stats.totalTrades, stats.previousTotalTrades)
    },
    {
      label: 'Open Trades',
      value: stats.openTrades || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500/10 text-yellow-500',
      trend: getTrendIcon(stats.openTrades, stats.previousOpenTrades)
    },
    {
      label: 'Closed Trades',
      value: stats.closedTrades || 0,
      icon: ChartBarIcon,
      color: 'bg-purple-500/10 text-purple-500',
      trend: getTrendIcon(stats.closedTrades, stats.previousClosedTrades)
    },
    {
      label: 'Win Rate',
      value: formatPercentage(stats.winRate),
      icon: TrendingUpIcon,
      color: stats.winRate >= 50 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
      trend: getTrendIcon(stats.winRate, stats.previousWinRate)
    },
    {
      label: 'Total PnL',
      value: formatCurrency(stats.totalPnL),
      icon: CurrencyDollarIcon,
      color: stats.totalPnL >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
      trend: getTrendIcon(stats.totalPnL, stats.previousTotalPnL),
      valueColor: getPnLColor(stats.totalPnL)
    },
    {
      label: 'Average RR',
      value: formatRatio(stats.avgRR),
      icon: ScaleIcon,
      color: 'bg-orange-500/10 text-orange-500',
      trend: getTrendIcon(stats.avgRR, stats.previousAvgRR)
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Trading Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon

          return (
            <div
              key={index}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.valueColor || 'text-foreground'}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
                {stat.trend && (
                  <div className="flex-shrink-0 bg-background/50 p-1.5 rounded-full">
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}