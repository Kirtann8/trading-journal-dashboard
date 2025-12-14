'use client'

import { memo, useCallback, useEffect, Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
}

const Modal = memo(({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  className = '',
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            ${sizes[size]} w-full pointer-events-auto
            card p-0 overflow-hidden
            animate-scale-in
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary/50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  )
})

Modal.displayName = 'Modal'

export default Modal
