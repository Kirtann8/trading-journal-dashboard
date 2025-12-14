'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { Input, Button, Card } from '@/components/ui'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    }
  },
  password: {
    required: 'Password is required'
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, error: authError } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)

  const { formData, errors, isSubmitting, setFormData, onSubmit } = useForm(
    { email: '', password: '' },
    validationRules
  )

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (data) => {
    const { success } = await login(data.email, data.password)
    
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 mesh-bg pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] orb-primary opacity-20 -translate-y-1/2 -translate-x-1/4" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] orb-accent opacity-15 translate-y-1/2 translate-x-1/4" />
      
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">TradingJournal</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight">
            Track your trades,<br />
            <span className="text-gradient">master your strategy</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Log your cryptocurrency trades, analyze your performance, and improve your trading strategy with powerful insights.
          </p>
          
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: 'Trades Logged', value: '10K+' },
              { label: 'Active Traders', value: '500+' },
              { label: 'Win Rate Avg', value: '67%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">TradingJournal</span>
          </div>
          
          <Card variant="glass" padding="lg" className="animate-fade-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="mt-2 text-muted-foreground">
                Sign in to continue to your dashboard
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                <p className="text-destructive text-sm font-medium">{authError}</p>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault()
              onSubmit(handleSubmit)
            }} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData('email', e.target.value)}
                error={errors.email}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData('password', e.target.value)}
                error={errors.password}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary/50 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>

                <Link 
                  href="#" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
                rightIcon={!isSubmitting && <ArrowRightIcon className="w-4 h-4" />}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}