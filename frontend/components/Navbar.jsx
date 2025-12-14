'use client'

import { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Avatar from '@/components/ui/Avatar'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Trades', href: '/trades', icon: ChartBarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
]

const NavLink = memo(({ item, isActive, onClick }) => {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 group
        ${isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }
      `}
    >
      <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
      <span>{item.name}</span>
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
      )}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

const MobileNavLink = memo(({ item, isActive, onClick }) => {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-primary/10 text-primary border-l-4 border-primary'
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-l-4 border-transparent'
        }
      `}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
      {item.name}
    </Link>
  )
})

MobileNavLink.displayName = 'MobileNavLink'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = useCallback((href) => pathname.startsWith(href), [pathname])
  
  const handleLogout = useCallback(() => {
    logout()
    setShowUserMenu(false)
    setIsOpen(false)
  }, [logout])

  const closeMenus = useCallback(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [])

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/30">
      <div className="container-custom">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 group"
              onClick={closeMenus}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                TradingJournal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <NavLink 
                key={item.name} 
                item={item} 
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-all duration-200 group"
              >
                <Avatar 
                  name={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}
                  size="sm"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.username || 'User')}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user?.email}
                  </p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 card p-2 animate-scale-in origin-top-right z-50">
                    <div className="px-3 py-2 border-b border-border/50 mb-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary/50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircleIcon className="w-5 h-5 text-muted-foreground" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-slide-down border-t border-border/30">
          <div className="p-4 space-y-2 bg-background/95 backdrop-blur-xl">
            {navigation.map((item) => (
              <MobileNavLink
                key={item.name}
                item={item}
                isActive={isActive(item.href)}
                onClick={() => setIsOpen(false)}
              />
            ))}
            
            <div className="pt-4 mt-4 border-t border-border/50">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar 
                  name={user?.username || user?.firstName}
                  size="md"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default memo(Navbar)