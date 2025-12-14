'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ProfileCard from '../../components/ProfileCard'
import StatsGrid from '../../components/StatsGrid'
import { SkeletonStats, SkeletonCard } from '../../components/ui/Skeleton'
import { Button, GradientOrb } from '../../components/ui'
import { getProfile, getStats } from '../../lib/api/profile'
import { 
  PlusIcon, 
  ChartBarIcon, 
  DocumentChartBarIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

// Lazy load the modal for better performance
const EditProfileModal = dynamic(() => import('../../components/EditProfileModal'), {
  loading: () => null,
  ssr: false
})

const QuickActionCard = memo(({ href, icon: Icon, title, description, variant = 'default' }) => {
  const variants = {
    default: 'card-hover',
    primary: 'card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40',
    success: 'card-hover bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:border-success/40',
    accent: 'card-hover bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
  }
  
  return (
    <Link href={href} className={`card p-6 ${variants[variant]} group block`}>
      <div className="flex items-start justify-between">
        <div className={`
          p-3 rounded-xl transition-all duration-300 group-hover:scale-110
          ${variant === 'primary' ? 'bg-primary/20' : variant === 'success' ? 'bg-success/20' : variant === 'accent' ? 'bg-accent/20' : 'bg-secondary'}
        `}>
          <Icon className={`w-6 h-6 ${variant === 'primary' ? 'text-primary' : variant === 'success' ? 'text-success' : variant === 'accent' ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        <ArrowRightIcon className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </Link>
  )
})

QuickActionCard.displayName = 'QuickActionCard'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [profileResult, statsResult] = await Promise.all([
        getProfile(),
        getStats()
      ])

      if (profileResult.success) {
        setProfile(profileResult.data)
      } else {
        throw new Error(profileResult.error)
      }

      if (statsResult.success) {
        setStats(statsResult.data)
      } else {
        throw new Error(statsResult.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setProfile(updatedProfile)
    setShowEditModal(false)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Skeleton Hero */}
        <div className="card p-8 overflow-hidden">
          <div className="space-y-3">
            <div className="h-8 w-2/3 bg-secondary/50 rounded-lg shimmer" />
            <div className="h-4 w-1/2 bg-secondary/50 rounded-lg shimmer" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SkeletonCard />
          </div>
          <div className="lg:col-span-2">
            <SkeletonStats />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="card max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load dashboard</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Hero Section with unique gradient effect */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <SparklesIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Welcome back</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Hello, <span className="text-gradient">{profile?.firstName || 'Trader'}</span>! 👋
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl text-lg">
            Your trading performance at a glance. Track your progress and refine your strategy.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <ProfileCard
            profile={profile}
            onEdit={() => setShowEditModal(true)}
          />
        </div>

        {/* Statistics Grid */}
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <StatsGrid stats={stats} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <QuickActionCard
            href="/trades/create"
            icon={PlusIcon}
            title="New Trade"
            description="Log a new trading position"
            variant="success"
          />
          <QuickActionCard
            href="/trades"
            icon={ChartBarIcon}
            title="View Trades"
            description="Browse all your trades"
            variant="primary"
          />
          <QuickActionCard
            href="/reports"
            icon={DocumentChartBarIcon}
            title="Reports"
            description="Analyze your performance"
            variant="accent"
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}