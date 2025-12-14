'use client'

import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon as TrendingUpIcon, ArrowTrendingDownIcon as TrendingDownIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatPercentage, formatDate } from '../lib/dashboard-utils'

export default function ProfileStats({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-secondary/50 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border border-border/50 rounded-lg bg-secondary/30">
              <div className="h-4 bg-secondary/50 rounded w-24 mb-2"></div>
              <div className="h-6 bg-secondary/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statItems = [
    {
      label: 'Member Since',
      value: stats?.memberSince ? formatDate(stats.memberSince) : 'Unknown',
      icon: CalendarIcon,
      color: 'text-primary'
    },
    {
      label: 'Total Trades',
      value: stats?.totalTrades || 0,
      icon: ChartBarIcon,
      color: 'text-muted-foreground'
    },
    {
      label: 'Total P&L',
      value: formatCurrency(stats?.totalPnL || 0),
      icon: stats?.totalPnL >= 0 ? TrendingUpIcon : TrendingDownIcon,
      color: stats?.totalPnL >= 0 ? 'text-success' : 'text-destructive',
      valueColor: stats?.totalPnL >= 0 ? 'text-success' : 'text-destructive'
    },
    {
      label: 'Win Rate',
      value: formatPercentage(stats?.winRate || 0),
      icon: TrendingUpIcon,
      color: stats?.winRate >= 50 ? 'text-success' : 'text-destructive',
      valueColor: stats?.winRate >= 50 ? 'text-success' : 'text-destructive'
    },
    {
      label: 'Best Trade',
      value: stats?.bestTrade?.profitLoss != null 
        ? formatCurrency(stats.bestTrade.profitLoss) 
        : (stats?.bestTrade != null && typeof stats.bestTrade === 'number' 
          ? formatCurrency(stats.bestTrade) 
          : '$0.00'),
      icon: TrendingUpIcon,
      color: 'text-success',
      valueColor: 'text-success'
    },
    {
      label: 'Worst Trade',
      value: stats?.worstTrade?.profitLoss != null 
        ? formatCurrency(stats.worstTrade.profitLoss) 
        : (stats?.worstTrade != null && typeof stats.worstTrade === 'number' 
          ? formatCurrency(stats.worstTrade) 
          : '$0.00'),
      icon: TrendingDownIcon,
      color: 'text-destructive',
      valueColor: 'text-destructive'
    }
  ]

  return (
    <div className="space-y-3">
      {statItems.map((item, index) => {
        const IconComponent = item.icon

        return (
          <div
            key={index}
            className="p-4 border border-border/50 rounded-xl hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-secondary/50`}>
                <IconComponent className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">{item.label}</p>
                <p className={`text-base font-bold truncate ${item.valueColor || 'text-foreground'}`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}

      {/* Additional Stats */}
      {stats?.avgTradeDuration && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Average Trade Duration</p>
            <p className="text-base font-semibold text-foreground mt-1">
              {stats.avgTradeDuration} days
            </p>
          </div>
        </div>
      )}
    </div>
  )
}