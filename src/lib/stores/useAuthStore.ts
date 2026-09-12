// ============================================
// AUTH STORE
// Zustand store for authentication state
// ============================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import { authService } from '@/lib/services'

interface AuthStore {
    // State
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    // Actions
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    setLoading: (loading: boolean) => void
    fetchUser: () => Promise<void>
    login: (email: string, password: string) => Promise<{ success: boolean; token?: string; user?: User; error?: string }>
    logout: () => Promise<void>
    reset: () => void
}

let fetchUserPromise: Promise<void> | null = null

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            token: null,
            isLoading: true,
            isAuthenticated: false,

            // Actions
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),
            setToken: (token) => set({ token }),
            setLoading: (isLoading) => set({ isLoading }),

            fetchUser: async () => {
                if (fetchUserPromise) {
                    return fetchUserPromise
                }

                fetchUserPromise = (async () => {
                    const currentToken = get().token || (typeof window !== 'undefined' ? (() => {
                        try {
                            const stored = localStorage.getItem('auth-storage')
                            return stored ? JSON.parse(stored)?.state?.token : null
                        } catch {
                            return null
                        }
                    })() : null)

                    // If no token exists and no session cookie, user is unauthenticated
                    if (!currentToken && typeof document !== 'undefined' && !document.cookie.includes('session=')) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                        return
                    }

                    set({ isLoading: true })
                    try {
                        const response = await authService.getCurrentUser()
                        if (response.success && response.data) {
                            set({
                                user: response.data,
                                token: currentToken || get().token,
                                isAuthenticated: true,
                                isLoading: false
                            })
                        } else {
                            set({
                                user: null,
                                token: null,
                                isAuthenticated: false,
                                isLoading: false
                            })
                        }
                    } catch {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                    }
                })().finally(() => {
                    fetchUserPromise = null
                })

                return fetchUserPromise
            },

            login: async (email, password) => {
                set({ isLoading: true })
                try {
                    const response = await authService.login(email, password)
                    if (response.success && response.data) {
                        const token = response.data.token
                        const user = response.data.user
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        if (typeof document !== 'undefined' && token) {
                            try {
                                document.cookie = `session=${token}; path=/; max-age=2592000; SameSite=Lax`
                            } catch {}
                        }

                        return { success: true, token, user }
                    }
                    set({ isLoading: false })
                    return { success: false, error: response.error }
                } catch {
                    set({ isLoading: false })
                    return { success: false, error: 'Login failed' }
                }
            },

            logout: async () => {
                try {
                    await authService.logout()
                } catch {}
                if (typeof document !== 'undefined') {
                    try {
                        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    } catch {}
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            },

            reset: () => {
                if (typeof document !== 'undefined') {
                    try {
                        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    } catch {}
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
        }
    )
)
