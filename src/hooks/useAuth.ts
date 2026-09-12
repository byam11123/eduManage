// ============================================
// USE AUTH HOOK
// Custom hook for authentication (wrapper around Zustand store)
// ============================================

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores'

export function useAuth() {
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const isLoading = useAuthStore((state) => state.isLoading)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const login = useAuthStore((state) => state.login)
    const logout = useAuthStore((state) => state.logout)
    const fetchUser = useAuthStore((state) => state.fetchUser)
    const setUser = useAuthStore((state) => state.setUser)
    const setToken = useAuthStore((state) => state.setToken)
    const reset = useAuthStore((state) => state.reset)

    // Auto-fetch user on mount if not already loaded and token is available
    useEffect(() => {
        if (!user && (token || (typeof document !== 'undefined' && document.cookie.includes('session=')))) {
            fetchUser()
        }
    }, [user, token, fetchUser])

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        fetchUser,
        setUser,
        setToken,
        reset
    }
}
