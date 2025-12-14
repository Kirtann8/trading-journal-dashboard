'use client'

import { useState } from 'react'
import { ExclamationTriangleIcon, ArrowRightOnRectangleIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function DangerZone({ onLogout, onDeleteAccount }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await onLogout()
    } finally {
      setIsLoading(false)
      setShowLogoutConfirm(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return

    setIsLoading(true)
    try {
      await onDeleteAccount()
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
        <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
      </div>

      <div className="space-y-4">
        {/* Logout */}
        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-secondary/30 transition-colors">
          <div>
            <h3 className="text-sm font-medium text-foreground">Logout</h3>
            <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
          <div>
            <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
            <p className="text-sm text-destructive/80">Permanently delete your account and all data</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-destructive flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="glass-card p-6 w-full max-w-md mx-4 shadow-2xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Logout</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout? You&apos;ll need to sign in again to access your account.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoading}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="glass-card p-6 w-full max-w-md mx-4 shadow-2xl border border-destructive/20">
            <div className="flex items-center space-x-2 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Delete Account</h3>
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                This action cannot be undone. This will permanently delete your account and all associated data including:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>All your trades and trading history</li>
                <li>Profile information and settings</li>
                <li>Account statistics and reports</li>
              </ul>
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="font-bold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="input-field border-destructive focus:ring-destructive"
                  placeholder="DELETE"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                disabled={isLoading}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmText !== 'DELETE'}
                className="btn-destructive flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}