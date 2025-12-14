'use client'

const SkeletonLoader = ({ 
  type = 'text', 
  lines = 1, 
  className = '',
  width = 'full',
  height = 'auto'
}) => {
  const getWidthClass = () => {
    if (typeof width === 'string') {
      switch (width) {
        case 'full': return 'w-full'
        case '3/4': return 'w-3/4'
        case '1/2': return 'w-1/2'
        case '1/3': return 'w-1/3'
        case '1/4': return 'w-1/4'
        default: return 'w-full'
      }
    }
    return `w-${width}`
  }

  const getHeightClass = () => {
    if (height === 'auto') {
      switch (type) {
        case 'title': return 'h-8'
        case 'subtitle': return 'h-6'
        case 'button': return 'h-10'
        case 'card': return 'h-32'
        case 'avatar': return 'h-10 w-10 rounded-full'
        case 'text':
        default: return 'h-4'
      }
    }
    return `h-${height}`
  }

  if (type === 'table') {
    return (
      <div className={`card ${className}`}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="table-header-cell">
                    <div className="skeleton h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="table-cell">
                      <div className="skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={`card ${className}`}>
        <div className="card-body">
          <div className="skeleton h-6 w-3/4 mb-4" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-4" />
          <div className="skeleton h-10 w-24" />
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className={`card ${className}`}>
        <div className="card-body space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
          <div className="flex justify-end space-x-3 pt-4">
            <div className="skeleton h-10 w-20" />
            <div className="skeleton h-10 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className={`grid-responsive ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="skeleton h-4 w-20 mb-2" />
                  <div className="skeleton h-6 w-16" />
                </div>
                <div className="skeleton h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Text skeleton (default)
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`skeleton ${getHeightClass()} ${
            i === lines - 1 && lines > 1 ? 'w-2/3' : getWidthClass()
          }`}
        />
      ))}
    </div>
  )
}

export default SkeletonLoader