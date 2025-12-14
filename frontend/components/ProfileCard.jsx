'use client'

import { PencilIcon, UserIcon } from '@heroicons/react/24/outline'
import { getInitials, formatDate, getRiskColor, getExperienceColor } from '../lib/dashboard-utils'

export default function ProfileCard({ profile, onEdit }) {
  if (!profile) return null

  return (
    <div className="glass-card rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Profile</h2>
        <button
          onClick={onEdit}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1 mb-4 shadow-lg shadow-primary/20">
          <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                {getInitials(profile.firstName, profile.lastName) || <UserIcon className="h-10 w-10 text-muted-foreground" />}
              </div>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {profile.firstName} {profile.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
          <span className="text-sm font-medium text-muted-foreground">Risk Preference</span>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(profile.riskPreference)}`}>
            {profile.riskPreference || 'Not set'}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
          <span className="text-sm font-medium text-muted-foreground">Experience</span>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getExperienceColor(profile.experienceLevel)}`}>
            {profile.experienceLevel || 'Not set'}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
          <span className="text-sm font-medium text-muted-foreground">Member Since</span>
          <span className="text-sm font-medium text-foreground">
            {profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  )
}