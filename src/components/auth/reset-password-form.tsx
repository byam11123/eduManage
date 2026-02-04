'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, CheckCircle2, XCircle } from 'lucide-react'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  // Password validation
  const passwordRegex = /^.{8,}$(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
  const isPasswordValid = passwordRegex.test(formData.password)
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.password !== ''

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset token. Please request a new password reset link.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or expired reset token. Please request a new password reset link.')
      return
    }

    // Validation
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)')
      return
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/?view=login')
      }, 3000)
    } catch (err) {
      setError('Failed to reset password. The link may be expired or invalid.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Invalid Reset Link</h3>
          <p className="text-sm text-muted-foreground">
            The password reset link is invalid or has expired.
          </p>
          <p className="text-sm text-muted-foreground">
            Please request a new password reset link.
          </p>
        </div>
        <Link href="/?view=forgot-password">
          <Button variant="outline" className="w-full">
            Request New Link
          </Button>
        </Link>
        <Link href="/?view=login">
          <Button variant="ghost" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Password Reset Successful</h3>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully reset.
          </p>
          <p className="text-sm text-muted-foreground">
            You will be redirected to login page shortly...
          </p>
        </div>
        <Link href="/?view=login">
          <Button variant="outline" className="w-full">
            Go to Login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a new password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        {formData.password && !isPasswordValid && (
          <p className="text-xs text-muted-foreground">
            Must be 8+ chars with uppercase, lowercase, number, and special char (@$!%*?&)
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            className="pl-10"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        {formData.confirmPassword && !isPasswordMatch && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
      </div>

      {/* Reset Password Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>

      {/* Back to Login */}
      <div className="flex justify-center">
        <Link href="/?view=login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to login
        </Link>
      </div>
    </form>
  )
}
