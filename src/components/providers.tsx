'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/lib/stores'

export function Providers({ children }: { children: React.ReactNode }) {
    // TanStack Query Client instance with sensible defaults
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    )

    useEffect(() => {
        // Global fetch interceptor to attach bearer token to all /api/ requests
        const originalFetch = window.fetch
        window.fetch = async (...args) => {
            const [resource, config] = args
            let url = ''
            if (typeof resource === 'string') {
                url = resource
            } else if (resource instanceof URL) {
                url = resource.toString()
            } else if (resource instanceof Request) {
                url = resource.url
            }

            const isApiRequest = url.startsWith('/api/') || url.includes('/api/')

            if (isApiRequest) {
                try {
                    // Try store first (in-memory), then fallback to localStorage
                    let token = useAuthStore.getState().token
                    if (!token) {
                        const authStorageStr = localStorage.getItem('auth-storage')
                        if (authStorageStr) {
                            const authStorage = JSON.parse(authStorageStr)
                            token = authStorage.state?.token
                        }
                    }

                    if (token) {
                        const headers = new Headers(
                            config?.headers || (resource instanceof Request ? resource.headers : undefined)
                        )
                        if (!headers.has('Authorization')) {
                            headers.set('Authorization', `Bearer ${token}`)
                        }

                        const newConfig = { ...config, headers }
                        const response = resource instanceof Request
                            ? await originalFetch(new Request(resource, newConfig))
                            : await originalFetch(resource, newConfig)

                        // If receiving 401 on an authenticated non-auth endpoint, handle session expiration
                        if (response.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/signup')) {
                            console.warn('[Session] Received 401 Unauthorized for:', url)
                        }

                        return response
                    }
                } catch (e) {
                    console.error('Fetch interceptor error:', e)
                }
            }

            return originalFetch(...args)
        }

        // Cross-tab authentication synchronization
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'auth-storage') {
                try {
                    if (!event.newValue) {
                        useAuthStore.getState().reset()
                    } else {
                        const parsed = JSON.parse(event.newValue)
                        const state = parsed.state
                        if (state?.user) {
                            useAuthStore.getState().setUser(state.user)
                        }
                        if (state?.token) {
                            useAuthStore.getState().setToken(state.token)
                        }
                    }
                } catch (err) {
                    console.error('Failed to sync auth storage:', err)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider delayDuration={0}>
                    {children}
                </TooltipProvider>
                <Toaster />
                <SonnerToaster position="top-center" />
            </NextThemesProvider>
        </QueryClientProvider>
    )
}
