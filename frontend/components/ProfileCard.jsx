'use client'

import { memo } from 'react'
import { PencilIcon, UserIcon, ShieldCheckIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { getInitials, formatDate, getRiskColor, getExperienceColor } from '../lib/dashboard-utils'
import { Card, Badge, Avatar } from '@/components/ui'

const ProfileCard = memo(function ProfileCard({ profile, onEdit }) {
  if (!profile) return null

  const getRiskBadgeVariant = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getExperienceBadgeVariant = (exp) => {
    switch (exp?.toLowerCase()) {
      case 'expert': return 'accent'
      case 'advanced': return 'primary'
      case 'intermediate': return 'success'
      case 'beginner': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Card variant="glass" padding="none" className="h-full overflow-hidden">
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 rounded-xl bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-background/80 transition-all duration-200 group"
          title="Edit profile"
        >
          <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Avatar - positioned to overlap header */}
      <div className="relative px-6 -mt-12">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-glow">
            <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gradient">
                  {getInitials(profile.firstName, profile.lastName) || <UserIcon className="h-10 w-10 text-muted-foreground" />}
                </span>
              )}
            </div>
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full ring-2 ring-background" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 pt-4">
        <h3 className="text-xl font-bold text-foreground">
          {profile.firstName} {profile.lastName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">@{profile.username || 'trader'}</p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>

        {/* Stats */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                <ShieldCheckIcon className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Risk Tolerance</span>
            </div>
            <Badge variant={getRiskBadgeVariant(profile.riskPreference)}>
              {profile.riskPreference || 'Not set'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <AcademicCapIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Experience</span>
            </div>
            <Badge variant={getExperienceBadgeVariant(profile.experienceLevel)}>
              {profile.experienceLevel || 'Not set'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                <CalendarIcon className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Member Since</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
})

export default ProfileCard