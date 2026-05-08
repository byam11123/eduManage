import bcrypt from 'bcryptjs'
import * as jose from 'jose'

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
const JWT_SECRET_ENCODED = new TextEncoder().encode(JWT_SECRET)
const JWT_EXPIRY = '7d' // Token expires in 7 days

export interface JWTPayload {
  userId: string
  email: string
  role: string
  branches: string[]
  organizationId?: string
  defaultBranchId?: string
  iat?: number
  exp?: number
}

// Sign JWT token
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new jose.SignJWT({ ...payload as any })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET_ENCODED)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET_ENCODED)
    return payload as unknown as JWTPayload
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

  const payload = await verifyToken(token)
  if (!payload) {
    return { success: false }
  }

  return {
    success: true,
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    branches: payload.branches,
    organizationId: payload.organizationId
  }
}
