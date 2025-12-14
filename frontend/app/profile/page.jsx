'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from '../../components/ProfileForm'
import PasswordChangeForm from '../../components/PasswordChangeForm'
import ProfileStats from '../../components/ProfileStats'
import DangerZone from '../../components/DangerZone'
import ErrorFallback from '../../components/ErrorFallback'
import { useApp } from '../../context/AppContext'
import { getProfile, updateProfile, getProfileStats } from '../../lib/api/profile'
import { changePassword, logout, deleteAccount } from '../../lib/api/auth'
import { handleApiError } from '../../lib/errorHandler'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const { handleError: showError, handleSuccess } = useApp()

  useEffect(() => {
    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfileData = async () => {
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
        // Fallback to mock data if stats API fails
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
  }

  const handleProfileUpdate = async (updatedData) => {
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
  }

  const handlePasswordChange = async (passwordData) => {
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
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      const appError = handleApiError(error, { action: 'logout' })
      showError(appError)
    }
  }

  const handleDeleteAccount = async () => {
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
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-secondary/50 rounded-xl"></div>
        <div className="h-64 bg-secondary/50 rounded-xl"></div>
        <div className="h-64 bg-secondary/50 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">
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

      {/* Profile Information Section */}
      <ProfileForm
        profile={profile}
        onUpdate={handleProfileUpdate}
        isLoading={loading}
      />

      {/* Account Statistics Section */}
      <ProfileStats
        stats={stats}
        isLoading={loading}
      />

      {/* Password Change Section */}
      <PasswordChangeForm
        onPasswordChange={handlePasswordChange}
      />

      {/* Danger Zone Section */}
      <DangerZone
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}