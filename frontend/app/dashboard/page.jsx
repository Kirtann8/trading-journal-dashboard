'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProfileCard from '../../components/ProfileCard'
import StatsGrid from '../../components/StatsGrid'
import EditProfileModal from '../../components/EditProfileModal'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import { getProfile, getStats } from '../../lib/api/profile'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchData = async () => {
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
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile)
    setShowEditModal(false)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
        <button
          onClick={fetchData}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 p-8 border border-primary/10">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-gradient">{profile?.firstName || 'Trader'}</span>!
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Your trading performance at a glance. Track your progress and refine your strategy.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard
            profile={profile}
            onEdit={() => setShowEditModal(true)}
          />
        </div>

        {/* Statistics Grid */}
        <div className="lg:col-span-2">
          <StatsGrid stats={stats} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/trades/create" className="btn-success w-full justify-center py-4 text-base shadow-lg shadow-success/20 hover:shadow-success/40 transition-all hover:-translate-y-0.5">
            Add New Trade
          </Link>
          <Link href="/trades" className="btn-primary w-full justify-center py-4 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
            View All Trades
          </Link>
          <Link href="/reports" className="btn-secondary w-full justify-center py-4 text-base hover:bg-secondary/80 transition-all hover:-translate-y-0.5">
            Generate Report
          </Link>
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