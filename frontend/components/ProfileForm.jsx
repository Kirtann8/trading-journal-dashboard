'use client'

import { useState } from 'react'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ProfileForm({ profile, onUpdate, isLoading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    riskPreference: profile?.riskPreference || '',
    experienceLevel: profile?.experienceLevel || ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      riskPreference: profile?.riskPreference || '',
      experienceLevel: profile?.experienceLevel || ''
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      riskPreference: profile?.riskPreference || '',
      experienceLevel: profile?.experienceLevel || ''
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      await onUpdate(formData)
      setIsEditing(false)
      setErrors({})
    } catch (error) {
      setErrors({ general: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-secondary/50 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-secondary/50 rounded w-24 mb-2"></div>
              <div className="h-10 bg-secondary/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="input-field opacity-60 cursor-not-allowed bg-secondary/50"
          />
        </div>

        {/* Username (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Username
          </label>
          <input
            type="text"
            value={profile?.username || profile?.email?.split('@')[0] || ''}
            disabled
            className="input-field opacity-60 cursor-not-allowed bg-secondary/50"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={isEditing ? formData.firstName : (profile?.firstName || '')}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'opacity-60 cursor-not-allowed bg-secondary/50' : ''
              } ${errors.firstName ? 'border-destructive focus:ring-destructive' : ''}`}
          />
          {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={isEditing ? formData.lastName : (profile?.lastName || '')}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'opacity-60 cursor-not-allowed bg-secondary/50' : ''
              } ${errors.lastName ? 'border-destructive focus:ring-destructive' : ''}`}
          />
          {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
        </div>

        {/* Risk Preference */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Risk Preference
          </label>
          <select
            value={isEditing ? formData.riskPreference : (profile?.riskPreference || '')}
            onChange={(e) => handleChange('riskPreference', e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'opacity-60 cursor-not-allowed bg-secondary/50' : ''
              }`}
          >
            <option value="">Select preference</option>
            <option value="Low">Low</option>
            <option value="Med">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Experience Level
          </label>
          <select
            value={isEditing ? formData.experienceLevel : (profile?.experienceLevel || '')}
            onChange={(e) => handleChange('experienceLevel', e.target.value)}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'opacity-60 cursor-not-allowed bg-secondary/50' : ''
              }`}
          >
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border/50">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="btn-outline flex items-center space-x-2"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            <CheckIcon className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </div>
  )
}