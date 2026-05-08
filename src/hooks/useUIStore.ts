// ============================================
// USE UI STORE HOOK
// Wrapper for UI-related state (sidebar, etc.)
// ============================================

import { useUIStore as useUIStoreInternal } from '@/lib/stores'

export function useUIStore() {
    // Basic state
    const isSidebarOpen = useUIStoreInternal((state) => state.sidebarOpen)
    const isSidebarCollapsed = useUIStoreInternal((state) => state.sidebarCollapsed)
    const sidebarExpandedItems = useUIStoreInternal((state) => state.sidebarExpandedItems)
    
    // Actions
    const toggleSidebar = useUIStoreInternal((state) => state.toggleSidebar)
    const setSidebarOpen = useUIStoreInternal((state) => state.setSidebarOpen)
    const toggleSidebarCollapsed = useUIStoreInternal((state) => state.toggleSidebarCollapsed)
    const toggleSidebarItem = useUIStoreInternal((state) => state.toggleSidebarItem)
    const closeSidebar = useUIStoreInternal((state) => state.closeSidebar)

    return {
        isSidebarOpen,
        isSidebarCollapsed,
        sidebarExpandedItems,
        toggleSidebar,
        setSidebarOpen,
        toggleSidebarCollapsed,
        toggleSidebarItem,
        closeSidebar
    }
}
