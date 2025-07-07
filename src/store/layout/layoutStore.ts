import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface LayoutConfig {
  id: string
  name: string
  type: 'grid' | 'custom' | 'focus' | 'pip' | 'mosaic'
  gridConfig?: {
    cols: number
    rows: number
    gaps: number
  }
  customConfig?: {
    positions: Array<{
      streamId: string
      x: number
      y: number
      width: number
      height: number
      zIndex: number
    }>
  }
  focusConfig?: {
    primaryStreamId: string
    secondaryStreams: string[]
  }
  settings: {
    showChatOverlay: boolean
    syncAudio: boolean
    lowLatencyMode: boolean
    autoQuality: boolean
  }
  createdAt: Date
  lastUsed: Date
}

interface LayoutState {
  // Current layout
  activeLayoutId: string | null
  currentGridLayout: string
  
  // Saved layouts
  savedLayouts: LayoutConfig[]
  
  // Layout settings
  settings: {
    autoSaveLayouts: boolean
    maxSavedLayouts: number
    defaultLayout: string
    rememberLastLayout: boolean
  }
  
  // Responsive settings
  mobileLayout: string
  tabletLayout: string
  desktopLayout: string
  
  // Actions
  actions: {
    // Layout management
    setActiveLayout: (layoutId: string | null) => void
    setCurrentGridLayout: (layout: string) => void
    
    // Saved layouts
    saveLayout: (layout: Omit<LayoutConfig, 'id' | 'createdAt' | 'lastUsed'>) => void
    updateLayout: (layoutId: string, updates: Partial<LayoutConfig>) => void
    deleteLayout: (layoutId: string) => void
    duplicateLayout: (layoutId: string, newName?: string) => void
    
    // Quick actions
    createQuickLayout: (streams: string[], type: LayoutConfig['type']) => void
    applyLayout: (layoutId: string) => void
    resetToDefault: () => void
    
    // Settings
    updateSettings: (settings: Partial<LayoutState['settings']>) => void
    setResponsiveLayout: (device: 'mobile' | 'tablet' | 'desktop', layout: string) => void
    
    // Layout operations
    optimizeLayout: (streamCount: number) => void
    autoArrangeStreams: (streamIds: string[]) => void
  }
}

const DEFAULT_LAYOUTS: Omit<LayoutConfig, 'id' | 'createdAt' | 'lastUsed'>[] = [
  {
    name: '2x2 Grid',
    type: 'grid',
    gridConfig: { cols: 2, rows: 2, gaps: 8 },
    settings: {
      showChatOverlay: false,
      syncAudio: false,
      lowLatencyMode: false,
      autoQuality: true
    }
  },
  {
    name: '3x3 Grid',
    type: 'grid',
    gridConfig: { cols: 3, rows: 3, gaps: 6 },
    settings: {
      showChatOverlay: false,
      syncAudio: false,
      lowLatencyMode: false,
      autoQuality: true
    }
  },
  {
    name: 'Focus Mode',
    type: 'focus',
    focusConfig: {
      primaryStreamId: '',
      secondaryStreams: []
    },
    settings: {
      showChatOverlay: true,
      syncAudio: true,
      lowLatencyMode: false,
      autoQuality: true
    }
  }
]

export const useLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        activeLayoutId: null,
        currentGridLayout: 'grid-2x2',
        savedLayouts: [],
        settings: {
          autoSaveLayouts: true,
          maxSavedLayouts: 20,
          defaultLayout: 'grid-2x2',
          rememberLastLayout: true
        },
        mobileLayout: 'grid-1x1',
        tabletLayout: 'grid-2x2',
        desktopLayout: 'grid-3x3',
        
        actions: {
          setActiveLayout: (layoutId) => set((state) => {
            state.activeLayoutId = layoutId
            
            if (layoutId) {
              const layout = state.savedLayouts.find(l => l.id === layoutId)
              if (layout) {
                layout.lastUsed = new Date()
                if (layout.type === 'grid' && layout.gridConfig) {
                  state.currentGridLayout = `${layout.gridConfig.cols}x${layout.gridConfig.rows}`
                }
              }
            }
          }),
          
          setCurrentGridLayout: (layout) => set((state) => {
            state.currentGridLayout = layout
            
            // Auto-save if enabled
            if (state.settings.autoSaveLayouts) {
              const existingLayout = state.savedLayouts.find(l => l.name === `Quick ${layout}`)
              if (!existingLayout) {
                const [cols, rows] = layout.split('x').map(Number).filter(n => !isNaN(n))
                get().actions.saveLayout({
                  name: `Quick ${layout}`,
                  type: 'grid',
                  gridConfig: { cols: cols || 2, rows: rows || 2, gaps: 8 },
                  settings: {
                    showChatOverlay: false,
                    syncAudio: false,
                    lowLatencyMode: false,
                    autoQuality: true
                  }
                })
              }
            }
          }),
          
          saveLayout: (layout) => set((state) => {
            const id = `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            const now = new Date()
            
            const newLayout: LayoutConfig = {
              ...layout,
              id,
              createdAt: now,
              lastUsed: now
            }
            
            state.savedLayouts.push(newLayout)
            
            // Limit number of saved layouts
            if (state.savedLayouts.length > state.settings.maxSavedLayouts) {
              // Remove oldest unused layouts
              state.savedLayouts.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
              state.savedLayouts = state.savedLayouts.slice(0, state.settings.maxSavedLayouts)
            }
          }),
          
          updateLayout: (layoutId, updates) => set((state) => {
            const layout = state.savedLayouts.find(l => l.id === layoutId)
            if (layout) {
              Object.assign(layout, updates)
              layout.lastUsed = new Date()
            }
          }),
          
          deleteLayout: (layoutId) => set((state) => {
            state.savedLayouts = state.savedLayouts.filter(l => l.id !== layoutId)
            if (state.activeLayoutId === layoutId) {
              state.activeLayoutId = null
            }
          }),
          
          duplicateLayout: (layoutId, newName) => set((state) => {
            const layout = state.savedLayouts.find(l => l.id === layoutId)
            if (layout) {
              const { id, createdAt, lastUsed, ...layoutData } = layout
              get().actions.saveLayout({
                ...layoutData,
                name: newName || `${layout.name} (Copy)`
              })
            }
          }),
          
          createQuickLayout: (streamIds, type) => set((state) => {
            const count = streamIds.length
            let gridConfig
            
            if (type === 'grid') {
              // Calculate optimal grid size
              const cols = Math.ceil(Math.sqrt(count))
              const rows = Math.ceil(count / cols)
              gridConfig = { cols, rows, gaps: 8 }
            }
            
            get().actions.saveLayout({
              name: `Quick ${type} - ${count} streams`,
              type,
              ...(gridConfig && { gridConfig }),
              settings: {
                showChatOverlay: false,
                syncAudio: false,
                lowLatencyMode: false,
                autoQuality: true
              }
            })
          }),
          
          applyLayout: (layoutId) => set((state) => {
            const layout = state.savedLayouts.find(l => l.id === layoutId)
            if (layout) {
              state.activeLayoutId = layoutId
              layout.lastUsed = new Date()
              
              if (layout.type === 'grid' && layout.gridConfig) {
                state.currentGridLayout = `${layout.gridConfig.cols}x${layout.gridConfig.rows}`
              }
            }
          }),
          
          resetToDefault: () => set((state) => {
            state.activeLayoutId = null
            state.currentGridLayout = state.settings.defaultLayout
          }),
          
          updateSettings: (newSettings) => set((state) => {
            Object.assign(state.settings, newSettings)
          }),
          
          setResponsiveLayout: (device, layout) => set((state) => {
            switch (device) {
              case 'mobile':
                state.mobileLayout = layout
                break
              case 'tablet':
                state.tabletLayout = layout
                break
              case 'desktop':
                state.desktopLayout = layout
                break
            }
          }),
          
          optimizeLayout: (streamCount) => set((state) => {
            // Auto-select best layout for stream count
            let optimalLayout: string
            
            if (streamCount === 1) optimalLayout = '1x1'
            else if (streamCount === 2) optimalLayout = '2x1'
            else if (streamCount <= 4) optimalLayout = '2x2'
            else if (streamCount <= 6) optimalLayout = '3x2'
            else if (streamCount <= 9) optimalLayout = '3x3'
            else optimalLayout = '4x4'
            
            state.currentGridLayout = optimalLayout
          }),
          
          autoArrangeStreams: (streamIds) => set((state) => {
            // Create optimal arrangement based on stream count
            const count = streamIds.length
            if (count > 0) {
              get().actions.optimizeLayout(count)
              get().actions.createQuickLayout(streamIds, 'grid')
            }
          })
        }
      })),
      {
        name: 'layout-store',
        version: 1,
        partialize: (state) => ({
          savedLayouts: state.savedLayouts,
          settings: state.settings,
          mobileLayout: state.mobileLayout,
          tabletLayout: state.tabletLayout,
          desktopLayout: state.desktopLayout,
          currentGridLayout: state.currentGridLayout
        })
      }
    ),
    { name: 'LayoutStore' }
  )
)

// Initialize default layouts
if (typeof window !== 'undefined') {
  const { savedLayouts, actions } = useLayoutStore.getState()
  if (savedLayouts.length === 0) {
    DEFAULT_LAYOUTS.forEach(layout => {
      actions.saveLayout(layout)
    })
  }
}

// Selectors
export const selectActiveLayoutId = (state: LayoutState) => state.activeLayoutId
export const selectCurrentGridLayout = (state: LayoutState) => state.currentGridLayout
export const selectSavedLayouts = (state: LayoutState) => state.savedLayouts
export const selectLayoutSettings = (state: LayoutState) => state.settings
export const selectLayoutActions = (state: LayoutState) => state.actions

// Compound selectors
export const selectActiveLayout = (state: LayoutState) => 
  state.savedLayouts.find(l => l.id === state.activeLayoutId) || null

export const selectRecentLayouts = (state: LayoutState) =>
  [...state.savedLayouts]
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
    .slice(0, 5)

export const selectLayoutByType = (type: LayoutConfig['type']) => (state: LayoutState) =>
  state.savedLayouts.filter(l => l.type === type)