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
    isLoading: boolean
    isAuthenticated: boolean

    // Actions
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    fetchUser: () => Promise<void>
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    reset: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            isLoading: true,
            isAuthenticated: false,

            // Actions
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),

            setLoading: (isLoading) => set({ isLoading }),

            fetchUser: async () => {
                set({ isLoading: true })
                try {
                    const response = await authService.getCurrentUser()
                    if (response.success && response.data) {
                        set({
                            user: response.data,
                            isAuthenticated: true,
                            isLoading: false
                        })
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                    }
                } catch {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    })
                }
            },

            login: async (email, password) => {
                set({ isLoading: true })
                try {
                    const response = await authService.login(email, password)
                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false
                        })
                        return { success: true }
                    }
                    set({ isLoading: false })
                    return { success: false, error: response.error }
                } catch {
                    set({ isLoading: false })
                    return { success: false, error: 'Login failed' }
                }
            },

            logout: async () => {
                await authService.logout()
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            },

            reset: () => set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
        }
    )
)
