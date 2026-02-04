// ============================================
// AUTH SERVICE
// Centralized API calls for authentication
// ============================================

import type { User, ApiResponse } from '@/lib/types'

export const authService = {
    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<ApiResponse<User>> {
        try {
            const res = await fetch('/api/auth/me')
            const data = await res.json()
            return {
                success: data.success,
                data: data.user,
                error: data.error
            }
        } catch (error) {
            console.error('authService.getCurrentUser error:', error)
            return { success: false, error: 'Failed to fetch user' }
        }
    },

    /**
     * Login with email and password
     */
    async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.success ? { user: data.user, token: data.token } : undefined,
                error: data.error
            }
        } catch (error) {
            console.error('authService.login error:', error)
            return { success: false, error: 'Failed to login' }
        }
    },

    /**
     * Signup with email
     */
    async signup(email: string, fullName: string, password: string): Promise<ApiResponse<void>> {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fullName, password })
            })
            const data = await res.json()
            return {
                success: data.success,
                error: data.error,
                message: data.message
            }
        } catch (error) {
            console.error('authService.signup error:', error)
            return { success: false, error: 'Failed to signup' }
        }
    },

    /**
     * Verify OTP
     */
    async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ user: User; token: string }>> {
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.success ? { user: data.user, token: data.token } : undefined,
                error: data.error
            }
        } catch (error) {
            console.error('authService.verifyOtp error:', error)
            return { success: false, error: 'Failed to verify OTP' }
        }
    },

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse<void>> {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            const data = await res.json()
            return {
                success: data.success,
                error: data.error
            }
        } catch (error) {
            console.error('authService.logout error:', error)
            return { success: false, error: 'Failed to logout' }
        }
    }
}
