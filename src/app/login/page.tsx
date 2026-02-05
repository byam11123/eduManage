'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password'

function AuthContent() {
  const searchParams = useSearchParams()

  // Determine which view to show
  const viewParam = searchParams.get('view') as AuthView
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') as AuthView : undefined
  const hasToken = !!searchParams.get('token')

  // Determine which view to show
  let view: AuthView = 'login'

  if (hasToken) {
    view = 'reset-password'
  } else if (viewParam && ['login', 'signup', 'forgot-password', 'reset-password'].includes(viewParam)) {
    view = viewParam
  } else if (hash && ['login', 'signup', 'forgot-password', 'reset-password'].includes(hash)) {
    view = hash
  }

  const renderContent = () => {
    switch (view) {
      case 'signup':
        return (
          <AuthLayout
            title="Create Account"
            description="Join thousands of coaching centers and simplify your operations"
          >
            <SignupForm />
          </AuthLayout>
        )

      case 'forgot-password':
        return (
          <AuthLayout
            title="Forgot Password"
            description="Enter your email to receive a password reset link"
          >
            <ForgotPasswordForm />
          </AuthLayout>
        )

      case 'reset-password':
        return (
          <AuthLayout
            title="Reset Password"
            description="Create a new secure password for your account"
          >
            <ResetPasswordForm />
          </AuthLayout>
        )

      case 'login':
      default:
        return (
          <AuthLayout
            title="Welcome Back"
            description="Sign in to your coaching management dashboard"
          >
            <LoginForm />
          </AuthLayout>
        )
    }
  }

  return <>{renderContent()}</>
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
