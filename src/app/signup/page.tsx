'use client'

import { AuthLayout } from '@/components/auth/auth-layout'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Account"
      description="Join thousands of coaching centers and simplify your operations"
    >
      <SignupForm />
    </AuthLayout>
  )
}
