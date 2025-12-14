'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon, ShieldCheckIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ProfileForm from '../../components/ProfileForm'
import PasswordChangeForm from '../../components/PasswordChangeForm'
import ProfileStats from '../../components/ProfileStats'
import DangerZone from '../../components/DangerZone'
import ErrorFallback from '../../components/ErrorFallback'
import { useApp } from '../../context/AppContext'
import { getProfile, updateProfile, getProfileStats } from '../../lib/api/profile'
import { changePassword, logout, deleteAccount } from '../../lib/api/auth'
import { handleApiError } from '../../lib/errorHandler'
import { Card, Badge } from '../../components/ui'
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton'

const ProfilePageSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
)

const SectionHeader = memo(function SectionHeader({ icon: Icon, title, description, badge }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {badge && <Badge variant="primary">{badge}</Badge>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
})

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const { handleError: showError, handleSuccess } = useApp()

  const fetchProfileData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [profileResult, statsResult] = await Promise.all([
        getProfile(),
        getProfileStats()
      ])

      if (profileResult.success) {
        setProfile(profileResult.data)
      } else {
        throw new Error(profileResult.error)
      }

      if (statsResult.success) {
        setStats({
          ...statsResult.data,
          memberSince: profileResult.data?.createdAt
        })
      } else {
        setStats({
          memberSince: profileResult.data?.createdAt,
          totalTrades: 0,
          totalPnL: 0,
          winRate: 0,
          bestTrade: 0,
          worstTrade: 0,
          avgTradeDuration: 0
        })
      }

    } catch (err) {
      const appError = handleApiError(err, { action: 'fetchProfileData' })
      setError(appError.message)
      showError(appError)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  const handleProfileUpdate = useCallback(async (updatedData) => {
    try {
      const result = await updateProfile(updatedData)

      if (result.success) {
        setProfile(result.data)
        handleSuccess('Profile updated successfully!')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      const appError = handleApiError(error, { action: 'updateProfile' })
      showError(appError)
      throw appError
    }
  }, [handleSuccess, showError])

  const handlePasswordChange = useCallback(async (passwordData) => {
    try {
      const result = await changePassword(passwordData)

      if (!result.success) {
        throw new Error(result.error)
      }

      if (passwordData.logoutOtherSessions) {
        handleSuccess('Password changed and other sessions logged out!')
      } else {
        handleSuccess('Password changed successfully!')
      }
    } catch (error) {
      const appError = handleApiError(error, { action: 'changePassword' })
      showError(appError)
      throw appError
    }
  }, [handleSuccess, showError])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      const appError = handleApiError(error, { action: 'logout' })
      showError(appError)
    }
  }, [router, showError])

  const handleDeleteAccount = useCallback(async () => {
    try {
      const result = await deleteAccount()

      if (result.success) {
        router.push('/login')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      const appError = handleApiError(error, { action: 'deleteAccount' })
      showError(appError)
    }
  }, [router, showError])

  if (loading) {
    return <ProfilePageSkeleton />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Error State */}
      {error && (
        <ErrorFallback
          type="500"
          title="Failed to Load Profile"
          message={error}
          onRetry={fetchProfileData}
          showHomeButton={false}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Section */}
          <Card variant="glass" className="p-6">
            <SectionHeader 
              icon={UserCircleIcon}
              title="Profile Information"
              description="Update your personal details and trading preferences"
            />
            <ProfileForm
              profile={profile}
              onUpdate={handleProfileUpdate}
              isLoading={loading}
            />
          </Card>

          {/* Password Change Section */}
          <Card variant="glass" className="p-6">
            <SectionHeader 
              icon={ShieldCheckIcon}
              title="Security"
              description="Manage your password and account security"
            />
            <PasswordChangeForm
              onPasswordChange={handlePasswordChange}
            />
          </Card>
        </div>

        {/* Right Column - Stats & Danger Zone */}
        <div className="space-y-6">
          {/* Account Statistics Section */}
          <Card variant="glass" className="p-6">
            <SectionHeader 
              icon={ChartBarIcon}
              title="Statistics"
              badge={stats?.totalTrades ? `${stats.totalTrades} trades` : null}
            />
            <ProfileStats
              stats={stats}
              isLoading={loading}
            />
          </Card>

          {/* Danger Zone Section */}
          <Card variant="glass" className="p-6 border-destructive/30">
            <SectionHeader 
              icon={ExclamationTriangleIcon}
              title="Danger Zone"
              description="Irreversible account actions"
            />
            <DangerZone
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}