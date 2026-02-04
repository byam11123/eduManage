import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Password validation - Updated for better matching
export function validatePassword(password: string): boolean {
  if (password.length < 8) {
    return false
  }

  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[@$!%*?&]/.test(password)

  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar
}

// OTP generation
export function generateOtp(length: number = 6): string {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10)
  }
  return otp
}

// Token generation for password reset
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// JWT Token utilities
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRY = '7d' // Token expires in 7 days

export interface JWTPayload {
  userId: string
  email: string
  role: string
  branches: string[]
  defaultBranchId?: string
  iat?: number
  exp?: number
}

// Sign JWT token
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

// Extract token from Authorization header or cookie
export function extractToken(request: Request): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try cookie
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const sessionCookie = cookies.find(c => c.startsWith('session='))
    if (sessionCookie) {
      return sessionCookie.substring('session='.length)
    }
  }

  return null
}

export async function verifyAuth(req: Request) {
  const token = extractToken(req)
  if (!token) {
    return { success: false }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { success: false }
  }

  return {
    success: true,
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    branches: payload.branches
  }
}
