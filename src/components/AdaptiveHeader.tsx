'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  Plus, 
  Menu, 
  MessageSquare, 
  Compass, 
  Zap, 
  Trash2,
  Share2,
  BookmarkPlus,
  LogIn,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import EnhancedLayoutSelector from './EnhancedLayoutSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from 'next/dynamic'
import StreamyyyLogo from './StreamyyyLogo'
import { Separator } from "@/components/ui/separator"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { useHotkeys } from 'react-hotkeys-hook'
import { cn } from '@/lib/utils'

const EnhancedAddStreamDialog = dynamic(() => import('./EnhancedAddStreamDialog'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-32" />
})

const LiveDiscovery = dynamic(() => import('./LiveDiscovery'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-96" />
})

const CommandPalette = dynamic(() => import('./CommandPalette'), {
  loading: () => null
})

interface AdaptiveHeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

const AdaptiveHeader = React.memo(function AdaptiveHeader({ onToggleChat, showChat }: AdaptiveHeaderProps) {
  const [showAddStream, setShowAddStream] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)
  
  const { 
    streams, 
    clearAllStreams
  } = useStreamStore()
  
  const { trackFeatureUsage, trackMenuItemClick } = useAnalytics()
  const { isSignedIn, user, isLoaded } = useUser()
  
  // Auto-hide header on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current
    
    if (latest > previous && latest > 100) {
      // Scrolling down - hide header
      setIsHidden(true)
    } else if (latest < previous) {
      // Scrolling up - show header
      setIsHidden(false)
    }
    
    // Make header compact after scrolling
    setIsCompact(latest > 50)
    lastScrollY.current = latest
  })
  
  // Command palette hotkey
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault()
    setShowCommandPalette(true)
    trackFeatureUsage('command_palette_opened')
  })
  
  // Quick action hotkeys
  useHotkeys('cmd+shift+a, ctrl+shift+a', () => {
    setShowAddStream(true)
    trackFeatureUsage('quick_add_stream')
  })
  
  useHotkeys('cmd+shift+d, ctrl+shift+d', () => {
    setShowDiscovery(true)
    trackFeatureUsage('quick_discovery')
  })
  
  useHotkeys('cmd+shift+c, ctrl+shift+c', () => {
    onToggleChat()
    trackFeatureUsage('quick_toggle_chat')
  })

  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  }

  const contextualActions = React.useMemo(() => {
    const actions = [
      {
        key: 'add',
        icon: Plus,
        label: 'Add Stream',
        action: () => setShowAddStream(true),
        disabled: streams.length >= 16,
        priority: 1
      },
      {
        key: 'discover',
        icon: Compass,
        label: 'Discover',
        action: () => setShowDiscovery(true),
        priority: 2
      },
      {
        key: 'chat',
        icon: MessageSquare,
        label: showChat ? 'Hide Chat' : 'Show Chat',
        action: onToggleChat,
        active: showChat,
        priority: 3
      }
    ]
    
    // Show only top priority actions in compact mode
    return isCompact ? actions.slice(0, 2) : actions
  }, [streams.length, showChat, isCompact, onToggleChat])
  
  return (
    <div>
      <motion.header
        variants={headerVariants}
        animate={isHidden ? "hidden" : "visible"}
        className={cn(
          "bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 transition-all duration-300",
          isCompact ? "shadow-sm" : "shadow-xs",
          "glass"
        )}
        style={{
          boxShadow: isCompact 
            ? "var(--elevation-2)" 
            : "var(--elevation-1)"
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="flex items-center justify-between transition-all duration-300"
            animate={{
              height: isCompact ? 48 : 64
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <motion.div
                animate={{
                  scale: isCompact ? 0.85 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <StreamyyyLogo size={isCompact ? "sm" : "md"} variant="gradient" useForHeader={true} iconOnly={true} />
              </motion.div>
            </Link>

            {/* Mobile Primary Actions */}
            <div className="flex items-center gap-2 md:hidden">
              {contextualActions.map(({ key, icon: Icon, label, action, disabled, active }) => (
                <Button
                  key={key}
                  onClick={action}
                  size="sm"
                  variant={active ? "default" : "ghost"}
                  className={cn(
                    "h-9 px-3 touch-target",
                    isCompact && "h-8 px-2"
                  )}
                  disabled={disabled}
                >
                  <Icon className="h-4 w-4" />
                  {!isCompact && key === 'add' && <span className="ml-1.5">Add</span>}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 touch-target",
                  isCompact && "h-8 w-8"
                )}
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                className="flex items-center gap-2"
                animate={{
                  scale: isCompact ? 0.9 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Command Palette Trigger */}
                <Button
                  onClick={() => setShowCommandPalette(true)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 gap-2 text-muted-foreground hover:text-foreground",
                    isCompact && "h-8 gap-1"
                  )}
                >
                  <Command className="h-4 w-4" />
                  <span className="text-xs">⌘K</span>
                </Button>

                {contextualActions.map(({ key, icon: Icon, label, action, disabled, active }) => (
                  <Button
                    key={key}
                    onClick={action}
                    size="sm"
                    variant={active ? "default" : key === 'add' ? "default" : "outline"}
                    className={cn(
                      "h-9",
                      isCompact && "h-8"
                    )}
                    disabled={disabled}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCompact && <span className="ml-2">{label}</span>}
                  </Button>
                ))}

                <AnimatePresence>
                  {!isCompact && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Link href="/amp-summer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                        >
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="ml-2 font-medium">AMP Summer</span>
                        </Button>
                      </Link>

                      <Separator orientation="vertical" className="h-6" />

                      <EnhancedLayoutSelector />
                      <SavedLayoutsDialog />
                      <ShareDialog />

                      <Separator orientation="vertical" className="h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <ThemeToggle />

                <Separator orientation="vertical" className="h-6" />

                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <div className="flex gap-2">
                    <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn("h-9", isCompact && "h-8")}
                      >
                        <LogIn className="h-4 w-4" />
                        {!isCompact && <span className="ml-2">Sign In</span>}
                      </Button>
                    </SignInButton>
                    {!isCompact && (
                      <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-9"
                        >
                          <span>Sign Up</span>
                        </Button>
                      </SignUpButton>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Floating Action Button for hidden actions */}
      <AnimatePresence>
        {isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40 md:hidden"
          >
            <Button
              onClick={() => setShowCommandPalette(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              style={{ boxShadow: "var(--elevation-4)" }}
            >
              <Command className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 md:hidden"
              style={{ boxShadow: "var(--elevation-4)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="h-8 w-8 p-0 touch-target"
                >
                  ×
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {/* Stream Count */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Active Streams</div>
                  <div className="text-2xl font-bold">{streams.length} / 16</div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      onToggleChat()
                      setShowMobileMenu(false)
                    }}
                    variant={showChat ? "default" : "outline"}
                    className="w-full justify-start h-12 touch-target"
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    {showChat ? 'Hide Chat' : 'Show Chat'}
                  </Button>

                  <Button
                    onClick={() => {
                      setShowCommandPalette(true)
                      setShowMobileMenu(false)
                    }}
                    variant="outline"
                    className="w-full justify-start h-12 touch-target"
                  >
                    <Command className="mr-3 h-5 w-5" />
                    Command Palette
                  </Button>

                  <Link href="/amp-summer" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10 touch-target"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Zap className="mr-3 h-5 w-5 text-yellow-600" />
                      AMP Summer
                    </Button>
                  </Link>

                  <Link href="/blog" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 touch-target"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <BookmarkPlus className="mr-3 h-5 w-5" />
                      Blog
                    </Button>
                  </Link>
                </div>

                {/* Layout Controls */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-3">Layout & Controls</div>
                  <div className="space-y-2">
                    <EnhancedLayoutSelector mobile />
                    <SavedLayoutsDialog mobile />
                    <ShareDialog mobile />
                  </div>
                </div>

                {/* Stream Management */}
                {streams.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => {
                        clearAllStreams()
                        setShowMobileMenu(false)
                      }}
                      variant="destructive"
                      className="w-full justify-start h-12 touch-target"
                    >
                      <Trash2 className="mr-3 h-5 w-5" />
                      Clear All Streams
                    </Button>
                  </div>
                )}

                {/* Theme Toggle */}
                <div className="pt-4 border-t border-border flex justify-center gap-3">
                  <ThemeToggle />
                  {isSignedIn ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <div className="flex gap-2">
                      <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 touch-target"
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="ml-2">Sign In</span>
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-9 touch-target"
                        >
                          <span>Sign Up</span>
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette 
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onToggleChat={onToggleChat}
        onOpenAddStream={() => setShowAddStream(true)}
        onOpenDiscovery={() => setShowDiscovery(true)}
        showChat={showChat}
      />

      {/* Dialogs */}
      <EnhancedAddStreamDialog 
        open={showAddStream} 
        onOpenChange={setShowAddStream} 
      />
      
      <Dialog open={showDiscovery} onOpenChange={setShowDiscovery}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Discover Live Streams</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[85vh]">
            <LiveDiscovery />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default AdaptiveHeader