'use client'

import { memo } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline'

const StatCard = memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  className = '',
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
}) => {
  const changeConfig = {
    positive: {
      icon: ArrowTrendingUpIcon,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    negative: {
      icon: ArrowTrendingDownIcon,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    neutral: {
      icon: MinusIcon,
      color: 'text-muted-foreground',
      bg: 'bg-secondary',
    },
  }

  const config = changeConfig[changeType]
  const ChangeIcon = config.icon

  return (
    <div className={`stat-card group ${className}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
              {value}
            </p>
          </div>
          
          {Icon && (
            <div className={`p-3 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
        </div>
        
        {(change !== undefined || description) && (
          <div className="flex items-center gap-2 flex-wrap">
            {change !== undefined && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg}`}>
                <ChangeIcon className={`w-3.5 h-3.5 ${config.color}`} />
                <span className={`text-xs font-semibold ${config.color}`}>
                  {changeType === 'positive' ? '+' : ''}{change}%
                </span>
              </div>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

StatCard.displayName = 'StatCard'

export default StatCard
