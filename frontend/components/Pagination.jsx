'use client'

import { useState, memo, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui'

const Pagination = memo(function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  itemsPerPage = 20,
  onPageChange,
  onLimitChange
}) {
  const [jumpToPage, setJumpToPage] = useState('')

  // Ensure all values are valid numbers
  const safeCurrentPage = Number(currentPage) || 1
  const safeTotalPages = Number(totalPages) || 1
  const safeTotalCount = Number(totalCount) || 0
  const safeItemsPerPage = Number(itemsPerPage) || 20

  const handleJumpToPage = useCallback((e) => {
    e.preventDefault()
    const page = parseInt(jumpToPage)
    if (page >= 1 && page <= safeTotalPages) {
      onPageChange(page)
      setJumpToPage('')
    }
  }, [jumpToPage, safeTotalPages, onPageChange])

  const getPageNumbers = useCallback(() => {
    const pages = []
    const maxVisible = 5

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, safeCurrentPage - 2)
      const end = Math.min(safeTotalPages, start + maxVisible - 1)

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < safeTotalPages) {
        if (end < safeTotalPages - 1) pages.push('...')
        pages.push(safeTotalPages)
      }
    }

    return pages
  }, [safeCurrentPage, safeTotalPages])

  const startItem = Math.max(1, (safeCurrentPage - 1) * safeItemsPerPage + 1)
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalCount)

  const PageButton = memo(function PageButton({ page, isActive, disabled, onClick }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all
          ${isActive 
            ? 'bg-primary text-white shadow-md shadow-primary/30' 
            : disabled
              ? 'text-muted-foreground cursor-default'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
      >
        {page}
      </button>
    )
  })

  const NavButton = memo(function NavButton({ direction, onClick, disabled, double = false }) {
    const icons = {
      left: double ? ChevronDoubleLeftIcon : ChevronLeftIcon,
      right: double ? ChevronDoubleRightIcon : ChevronRightIcon,
    }
    const Icon = icons[direction]
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all
          ${disabled 
            ? 'text-muted-foreground/30 cursor-not-allowed' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
      >
        <Icon className="h-5 w-5" />
      </button>
    )
  })

  return (
    <Card variant="glass" className="px-4 py-3">
      {/* Mobile pagination */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="px-4 py-2 text-sm font-medium text-foreground bg-secondary/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          {safeCurrentPage} / {safeTotalPages}
        </span>
        <button
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className="px-4 py-2 text-sm font-medium text-foreground bg-secondary/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{' '}
            <span className="font-semibold text-foreground">{endItem}</span> of{' '}
            <span className="font-semibold text-foreground">{safeTotalCount}</span> results
          </p>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Show:</label>
            <select
              value={safeItemsPerPage}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
              className="input-field h-9 w-20 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Jump to page */}
          <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Go to:</label>
            <input
              type="number"
              min="1"
              max={safeTotalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="#"
              className="input-field h-9 w-16 text-sm text-center"
            />
            <button
              type="submit"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Go
            </button>
          </form>

          {/* Page navigation */}
          <nav className="flex items-center gap-1">
            <NavButton 
              direction="left" 
              double 
              onClick={() => onPageChange(1)} 
              disabled={safeCurrentPage === 1} 
            />
            <NavButton 
              direction="left" 
              onClick={() => onPageChange(safeCurrentPage - 1)} 
              disabled={safeCurrentPage === 1} 
            />

            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers().map((page, index) => (
                <PageButton
                  key={index}
                  page={page}
                  isActive={page === safeCurrentPage}
                  disabled={page === '...'}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                />
              ))}
            </div>

            <NavButton 
              direction="right" 
              onClick={() => onPageChange(safeCurrentPage + 1)} 
              disabled={safeCurrentPage === safeTotalPages} 
            />
            <NavButton 
              direction="right" 
              double 
              onClick={() => onPageChange(safeTotalPages)} 
              disabled={safeCurrentPage === safeTotalPages} 
            />
          </nav>
        </div>
      </div>
    </Card>
  )
})

export default Pagination