// ============================================
// UI STORE
// Zustand store for UI state management
// ============================================

import { create } from 'zustand'

type ModalType = 'add' | 'edit' | 'delete' | 'view' | null

interface UIStore {
    // Sidebar State
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    sidebarExpandedItems: string[]

    // Modal State
    activeModal: ModalType
    modalData: unknown

    // Loading States
    globalLoading: boolean
    pageLoading: boolean

    // Theme
    theme: 'light' | 'dark' | 'system'

    // Actions
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    toggleSidebarItem: (item: string) => void

    openModal: (type: ModalType, data?: unknown) => void
    closeModal: () => void

    setGlobalLoading: (loading: boolean) => void
    setPageLoading: (loading: boolean) => void

    setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIStore>()((set) => ({
    // Initial State
    sidebarOpen: false,
    sidebarCollapsed: false,
    sidebarExpandedItems: [], // New state
    activeModal: null,
    modalData: null,
    globalLoading: false,
    pageLoading: false,
    theme: 'system',

    // Sidebar Actions
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    toggleSidebarItem: (item) => set((state) => ({
        sidebarExpandedItems: state.sidebarExpandedItems.includes(item)
            ? state.sidebarExpandedItems.filter((i) => i !== item)
            : [...state.sidebarExpandedItems, item]
    })),

    // Modal Actions
    openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),

    // Loading Actions
    setGlobalLoading: (globalLoading) => set({ globalLoading }),
    setPageLoading: (pageLoading) => set({ pageLoading }),

    // Theme Actions
    setTheme: (theme) => set({ theme })
}))
