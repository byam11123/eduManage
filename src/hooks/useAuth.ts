// ============================================
// USE AUTH HOOK
// Custom hook for authentication (wrapper around Zustand store)
// ============================================

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores'

export function useAuth() {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const login = useAuthStore((state) => state.login)
    const logout = useAuthStore((state) => state.logout)
    const fetchUser = useAuthStore((state) => state.fetchUser)
    const setUser = useAuthStore((state) => state.setUser)

    // Auto-fetch user on mount if not already loaded
    useEffect(() => {
        // Only fetch if we don't have a user and we haven't checked yet (isLoading is true by default)
        // OR simply fetch on mount if no user.
        if (!user) {
            fetchUser()
        }
    }, [fetchUser]) // Only depend on fetchUser (stable)

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        fetchUser,
        setUser
    }
}
