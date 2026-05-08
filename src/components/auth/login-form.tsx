'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('[LOGIN] ========== FORM SUBMISSION START =========')
      console.log('[LOGIN] Email:', formData.email)
      console.log('[LOGIN] Password length:', formData.password.length)
      console.log('[LOGIN] Remember:', formData.remember)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('[Login] Response:', data)

      if (!response.ok || !data.success) {
        setError(data.error || 'Login failed')
        return
      }

      // Login successful - use redirectTo from login response if available
      console.log('[Login] Login successful, response:', data)

      if (data.redirectTo) {
        console.log('[Login] Using redirectTo from response:', data.redirectTo)
        window.location.href = data.redirectTo
        return
      }

      // Fallback: fetch user info to determine redirect destination
      console.log('[Login] No redirectTo in response, fetching user info')
      const userResponse = await fetch('/api/auth/me')
      const userData = await userResponse.json()

      if (userData.success && userData.user) {
        const userRole = userData.user.role
        console.log('[Login] User role:', userRole)

        if (userRole === 'super_admin') {
          console.log('[Login] Redirecting super admin to /admin')
          window.location.href = '/admin'
        } else if (userRole === 'branch_admin' || userRole === 'user') {
          console.log('[Login] Redirecting branch user to /branch')
          window.location.href = '/branch'
        } else {
          console.log('[Login] Redirecting to /organization (new user)')
          window.location.href = '/organization'
        }
      } else {
        // Fallback to organization page if user info fetch fails
        console.log('[Login] Redirecting to /organization (fallback)')
        window.location.href = '/organization'
      }
    } catch (err) {
      console.error('[Login] Error:', err)
      setError('Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo Credentials Hint */}
      {process.env.NODE_ENV !== 'production' && (
        <Alert className="mb-4 border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
          <AlertDescription className="text-sm">
            <strong>Demo Account:</strong><br />
            📧 Email: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono">demo@coaching.com</code><br />
            🔑 Password: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono">Demo123!@#</code>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/?view=forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={formData.remember}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, remember: checked as boolean })
          }
          disabled={isLoading}
        />
        <Label
          htmlFor="remember"
          className="text-sm font-normal cursor-pointer"
        >
          Remember me
        </Label>
      </div>

      {/* Login Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={() => {
          // TODO: Implement Google OAuth
          console.log('Google sign in clicked - will be implemented with NextAuth')
        }}
      >
        <svg
          className="mr-2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
