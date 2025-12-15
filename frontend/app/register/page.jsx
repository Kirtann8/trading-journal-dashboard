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
  UserIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    }
  },
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    }
  },
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 1,
      message: 'First name cannot be empty'
    }
  },
  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 1,
      message: 'Last name cannot be empty'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    },
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter'
      if (!/[0-9]/.test(value)) return 'Password must contain a number'
      return null
    }
  },
  confirmPassword: {
    required: 'Please confirm your password'
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated, error: authError } = useAuth()
  const [success, setSuccess] = useState(false)

  const { formData, errors, isSubmitting, setFormData, onSubmit } = useForm(
    { email: '', username: '', firstName: '', lastName: '', password: '', confirmPassword: '' },
    validationRules
  )

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return
    }

    const { success } = await register(data.email, data.password, data.username, data.firstName, data.lastName)
    
    if (success) {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  const passwordsMatch = formData.password === formData.confirmPassword

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['bg-destructive', 'bg-orange-500', 'bg-amber-500', 'bg-success', 'bg-success']
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-muted'
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 mesh-bg pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] orb-accent opacity-20 -translate-y-1/2 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] orb-primary opacity-15 translate-y-1/2 -translate-x-1/4" />
      
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">TradingJournal</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight">
            Start your<br />
            <span className="text-gradient">trading journey</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Join thousands of traders who use TradingJournal to track, analyze, and improve their trading performance.
          </p>
          
          <div className="mt-10 space-y-4">
            {[
              'Track all your trades in one place',
              'Get detailed performance analytics',
              'Identify patterns in your trading',
              'Improve your win rate over time',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-success" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">TradingJournal</span>
          </div>
          
          <Card variant="glass" padding="lg" className="animate-fade-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Create account</h2>
              <p className="mt-2 text-muted-foreground">
                Start tracking your trades today
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                  <p className="text-success text-sm font-medium">
                    Account created! Redirecting to login...
                  </p>
                </div>
              </div>
            )}

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                <p className="text-destructive text-sm font-medium">{authError}</p>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault()
              onSubmit(handleSubmit)
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData('firstName', e.target.value)}
                  error={errors.firstName}
                  autoComplete="given-name"
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData('lastName', e.target.value)}
                  error={errors.lastName}
                  autoComplete="family-name"
                />
              </div>

              <Input
                label="Username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData('username', e.target.value)}
                error={errors.username}
                leftIcon={<UserIcon className="w-5 h-5" />}
                autoComplete="username"
              />

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

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData('password', e.target.value)}
                  error={errors.password}
                  leftIcon={<LockClosedIcon className="w-5 h-5" />}
                  autoComplete="new-password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < passwordStrength.strength ? passwordStrength.color : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData('confirmPassword', e.target.value)}
                error={errors.confirmPassword || (!passwordsMatch && formData.confirmPassword ? 'Passwords do not match' : '')}
                success={passwordsMatch && formData.confirmPassword}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={!passwordsMatch}
                className="w-full mt-2"
                rightIcon={!isSubmitting && <ArrowRightIcon className="w-4 h-4" />}
              >
                {isSubmitting ? 'Creating account... (server may need ~30s to wake up)' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}