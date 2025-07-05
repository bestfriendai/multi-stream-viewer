import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UIState {
  // Layout state
  sidebarOpen: boolean
  chatOpen: boolean
  settingsOpen: boolean
  
  // Modal state
  activeModal: string | null
  modalData: any
  
  // Mobile state
  mobileMenuOpen: boolean
  mobileStreamViewerOpen: boolean
  
  // Theme and appearance
  theme: 'light' | 'dark' | 'system'
  reducedMotion: boolean
  
  // Loading states
  globalLoading: boolean
  componentLoading: Record<string, boolean>
  
  // Toast/notification state
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }>
  
  // Actions
  actions: {
    // Layout actions
    setSidebarOpen: (open: boolean) => void
    setChatOpen: (open: boolean) => void
    setSettingsOpen: (open: boolean) => void
    
    // Modal actions
    openModal: (modal: string, data?: any) => void
    closeModal: () => void
    
    // Mobile actions
    setMobileMenuOpen: (open: boolean) => void
    setMobileStreamViewerOpen: (open: boolean) => void
    
    // Theme actions
    setTheme: (theme: 'light' | 'dark' | 'system') => void
    setReducedMotion: (reduced: boolean) => void
    
    // Loading actions
    setGlobalLoading: (loading: boolean) => void
    setComponentLoading: (component: string, loading: boolean) => void
    
    // Toast actions
    addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
  }
}

export const useUIStore = create<UIState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      sidebarOpen: false,
      chatOpen: false,
      settingsOpen: false,
      activeModal: null,
      modalData: null,
      mobileMenuOpen: false,
      mobileStreamViewerOpen: false,
      theme: 'system',
      reducedMotion: false,
      globalLoading: false,
      componentLoading: {},
      toasts: [],
      
      actions: {
        // Layout actions
        setSidebarOpen: (open) => set((state) => {
          state.sidebarOpen = open
        }),
        
        setChatOpen: (open) => set((state) => {
          state.chatOpen = open
        }),
        
        setSettingsOpen: (open) => set((state) => {
          state.settingsOpen = open
        }),
        
        // Modal actions
        openModal: (modal, data) => set((state) => {
          state.activeModal = modal
          state.modalData = data
        }),
        
        closeModal: () => set((state) => {
          state.activeModal = null
          state.modalData = null
        }),
        
        // Mobile actions
        setMobileMenuOpen: (open) => set((state) => {
          state.mobileMenuOpen = open
        }),
        
        setMobileStreamViewerOpen: (open) => set((state) => {
          state.mobileStreamViewerOpen = open
        }),
        
        // Theme actions
        setTheme: (theme) => set((state) => {
          state.theme = theme
          // Apply theme to DOM
          if (typeof document !== 'undefined') {
            if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
              document.documentElement.classList.toggle('dark', systemTheme === 'dark')
            } else {
              document.documentElement.classList.toggle('dark', theme === 'dark')
            }
          }
        }),
        
        setReducedMotion: (reduced) => set((state) => {
          state.reducedMotion = reduced
          // Apply to DOM
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('reduce-motion', reduced)
          }
        }),
        
        // Loading actions
        setGlobalLoading: (loading) => set((state) => {
          state.globalLoading = loading
        }),
        
        setComponentLoading: (component, loading) => set((state) => {
          if (loading) {
            state.componentLoading[component] = true
          } else {
            delete state.componentLoading[component]
          }
        }),
        
        // Toast actions
        addToast: (toast) => set((state) => {
          const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          state.toasts.push({
            ...toast,
            id,
            duration: toast.duration || 5000
          })
          
          // Auto-remove after duration
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              get().actions.removeToast(id)
            }, toast.duration || 5000)
          }
        }),
        
        removeToast: (id) => set((state) => {
          state.toasts = state.toasts.filter(toast => toast.id !== id)
        }),
        
        clearToasts: () => set((state) => {
          state.toasts = []
        })
      }
    })),
    { name: 'UIStore' }
  )
)

// Selectors for performance
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen
export const selectChatOpen = (state: UIState) => state.chatOpen
export const selectSettingsOpen = (state: UIState) => state.settingsOpen
export const selectActiveModal = (state: UIState) => state.activeModal
export const selectMobileMenuOpen = (state: UIState) => state.mobileMenuOpen
export const selectTheme = (state: UIState) => state.theme
export const selectGlobalLoading = (state: UIState) => state.globalLoading
export const selectToasts = (state: UIState) => state.toasts
export const selectUIActions = (state: UIState) => state.actions

// Compound selectors
export const selectIsAnyModalOpen = (state: UIState) => state.activeModal !== null
export const selectIsAnyLoading = (state: UIState) => 
  state.globalLoading || Object.keys(state.componentLoading).length > 0