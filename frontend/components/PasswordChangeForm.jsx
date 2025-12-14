'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function PasswordChangeForm({ onPasswordChange }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logoutOtherSessions, setLogoutOtherSessions] = useState(false)

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password)
    }
    return requirements
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const requirements = validatePassword(formData.newPassword)
      if (!requirements.length) {
        newErrors.newPassword = 'Password must be at least 8 characters'
      } else if (!requirements.uppercase) {
        newErrors.newPassword = 'Password must contain at least one uppercase letter'
      } else if (!requirements.number) {
        newErrors.newPassword = 'Password must contain at least one number'
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSuccess(false)

    try {
      await onPasswordChange({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        logoutOtherSessions
      })

      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setErrors({})

      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      setErrors({ general: error.message || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const getPasswordStrength = () => {
    if (!formData.newPassword) return null

    const requirements = validatePassword(formData.newPassword)
    const score = Object.values(requirements).filter(Boolean).length

    if (score === 3) return { label: 'Strong', color: 'text-success', bg: 'bg-success' }
    if (score === 2) return { label: 'Medium', color: 'text-warning', bg: 'bg-warning' }
    return { label: 'Weak', color: 'text-destructive', bg: 'bg-destructive' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>

      {success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 text-success rounded-md">
          Password changed successfully!
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              className={`input-field pr-10 ${errors.currentPassword ? 'border-destructive focus:ring-destructive' : ''
                }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.current ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && <p className="text-destructive text-sm mt-1">{errors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className={`input-field pr-10 ${errors.newPassword ? 'border-destructive focus:ring-destructive' : ''
                }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.new ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && <p className="text-destructive text-sm mt-1">{errors.newPassword}</p>}

          {/* Password Strength Indicator */}
          {formData.newPassword && passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bg}`}
                    style={{ width: `${(Object.values(validatePassword(formData.newPassword)).filter(Boolean).length / 3) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Requirements: 8+ characters, uppercase letter, number
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`input-field pr-10 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : ''
                }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.confirm ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Logout Other Sessions */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="logoutOtherSessions"
            checked={logoutOtherSessions}
            onChange={(e) => setLogoutOtherSessions(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
          />
          <label htmlFor="logoutOtherSessions" className="ml-2 text-sm text-muted-foreground">
            Logout all other sessions
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <CheckIcon className="h-4 w-4" />
            <span>{loading ? 'Changing Password...' : 'Change Password'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}