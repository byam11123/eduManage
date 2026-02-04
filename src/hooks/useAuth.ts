// ============================================
// USE AUTH HOOK
// Custom hook for authentication (wrapper around Zustand store)
// ============================================

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores'

export function useAuth() {
    const store = useAuthStore()

    // Auto-fetch user on mount if not already loaded
    useEffect(() => {
        if (!store.user && store.isLoading) {
            store.fetchUser()
        }
    }, [store])

    return {
        // State
        user: store.user,
        isLoading: store.isLoading,
        isAuthenticated: store.isAuthenticated,

        // Actions
        login: store.login,
        logout: store.logout,
        fetchUser: store.fetchUser,
        setUser: store.setUser
    }
}
