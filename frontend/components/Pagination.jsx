'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Pagination({
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

  const handleJumpToPage = (e) => {
    e.preventDefault()
    const page = parseInt(jumpToPage)
    if (page >= 1 && page <= safeTotalPages) {
      onPageChange(page)
      setJumpToPage('')
    }
  }

  const getPageNumbers = () => {
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
  }

  const startItem = Math.max(1, (safeCurrentPage - 1) * safeItemsPerPage + 1)
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalCount)

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile pagination */}
        <button
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>

          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Show:</label>
            <select
              value={safeItemsPerPage}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Jump to page */}
          <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Go to:</label>
            <input
              type="number"
              min="1"
              max={safeTotalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Page"
              className="w-16 border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Go
            </button>
          </form>

          {/* Page navigation */}
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === safeCurrentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : page === '...'
                    ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === safeTotalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}