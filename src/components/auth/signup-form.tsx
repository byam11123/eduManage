'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, User, ShieldCheck, Check, X, CheckCircle2 } from 'lucide-react'

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  // Password validation - individual checks for better feedback
  const hasMinLength = formData.password.length >= 8
  const hasLowercase = /[a-z]/.test(formData.password)
  const hasUppercase = /[A-Z]/.test(formData.password)
  const hasNumber = /\d/.test(formData.password)
  const hasSpecialChar = /[@$!%*?&]/.test(formData.password)
  const isPasswordValid = hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.password !== ''

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setError('Please enter your full name')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to send OTP')
        return
      }

      setShowOtp(true)
      setIsOtpVerified(false) // Reset OTP verified status
      startCountdown()

      // Show OTP in development
      if (process.env.NODE_ENV === 'development' && data.otp) {
        setSuccess(`OTP sent! (Development: ${data.otp})`)
      } else {
        setSuccess('OTP sent to your email address')
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      console.log('Verifying OTP:', formData.otp, 'for email:', formData.email)

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      })

      const data = await response.json()

      console.log('Verify OTP response:', data)

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to verify OTP')
        return
      }

      setIsOtpVerified(true)
      setSuccess('OTP verified successfully! Now you can create your account.')
    } catch (err) {
      console.error('Verify OTP error:', err)
      setError('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    setIsOtpVerified(false) // Reset verified status when resending

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to resend OTP')
        return
      }

      startCountdown()

      if (process.env.NODE_ENV === 'development' && data.otp) {
        setSuccess(`OTP resent! (Development: ${data.otp})`)
      } else {
        setSuccess('OTP resent to your email address')
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)')
      return
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match')
      return
    }

    if (!formData.agreeTerms) {
      setError('Please agree to terms and conditions')
      return
    }

    if (!isOtpVerified) {
      setError('Please verify your OTP code first by clicking the "Verify OTP" button')
      return
    }

    if (showOtp && formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }

    setIsLoading(true)

    try {
      console.log('Submitting signup with verified OTP:', formData.otp)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      console.log('Signup response:', data)

      if (!response.ok || !data.success) {
        setError(data.error || 'Signup failed')
        return
      }

      setSuccess('Account created successfully! Redirecting to login...')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      console.error('Signup error:', err)
      setError('Signup failed. Please check your OTP and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-green-700 dark:text-green-400">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="pl-10"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
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

      {/* Email OTP Verification */}
      <div className="space-y-2">
        <Label htmlFor="otp">Email Verification Code</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                className="pl-10"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setFormData({ ...formData, otp: value })
                }}
                required
                disabled={isLoading}
              />
            </div>
            {!showOtp ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleSendOtp}
                disabled={isLoading || !formData.email || !formData.fullName}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send OTP'
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0 ? `${countdown}s` : 'Resend'}
              </Button>
            )}
          </div>

          {/* Verify OTP Button */}
          {showOtp && (
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || formData.otp.length !== 6 || isOtpVerified}
              className="w-full"
              variant={isOtpVerified ? "outline" : "default"}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : isOtpVerified ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                  OTP Verified
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Verify OTP
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-3">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        
        {/* Password Requirements */}
        {formData.password && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {hasMinLength ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasLowercase ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={hasLowercase ? 'text-green-600' : 'text-muted-foreground'}>
                One lowercase letter (a-z)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasUppercase ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={hasUppercase ? 'text-green-600' : 'text-muted-foreground'}>
                One uppercase letter (A-Z)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasNumber ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                One number (0-9)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasSpecialChar ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}>
                One special character (@ $ ! % * ? &)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
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

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeTerms}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, agreeTerms: checked as boolean })
          }
          disabled={isLoading}
        />
        <Label
          htmlFor="terms"
          className="text-sm font-normal cursor-pointer leading-tight"
        >
          I agree to{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>

      {/* Signup Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !isOtpVerified || !isPasswordValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
