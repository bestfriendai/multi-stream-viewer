'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStreamStore } from '@/store/streamStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  Menu, 
  MessageSquare, 
  Compass, 
  Zap, 
  Trash2,
  Keyboard,
  Share2,
  BookmarkPlus,
  MoreVertical,
  LogIn,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import EnhancedLayoutSelector from './EnhancedLayoutSelector'
const EnhancedAddStreamDialog = dynamic(() => import('./EnhancedAddStreamDialog'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-32" />
})
const DiscoverPopup = dynamic(() => import('./DiscoverPopup'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-96" />
})
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from 'next/dynamic'
import StreamyyyLogo from './StreamyyyLogo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"

interface HeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

const Header = React.memo(function Header({ onToggleChat, showChat }: HeaderProps) {
  const [showAddStream, setShowAddStream] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  
  const { 
    streams, 
    clearAllStreams
  } = useStreamStore()
  
  const { trackFeatureUsage, trackMenuItemClick } = useAnalytics()
  const { isSignedIn, user, isLoaded } = useUser()
  
  // Debug logging
  console.log('Header - Clerk state:', { isLoaded, isSignedIn, user: user?.id })
  
  
  return (
    <div>
      <header className="relative sticky top-0 z-50 border-b border-border/20">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-background/90 to-background/70 border border-border/40 group-hover:border-primary/50 transition-all duration-300 backdrop-blur-sm shadow-lg group-hover:shadow-xl">
                  <StreamyyyLogo size="sm" variant="gradient" />
                </div>
              </Link>
            </motion.div>

            {/* Enhanced Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAddStream(true)}
                  size="sm"
                  className="h-9 px-3 font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg border-0"
                  disabled={streams.length >= 16}
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-1.5">Add</span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-3 border-border/40 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm"
                  onClick={() => setShowDiscovery(true)}
                >
                  <Compass className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-muted/60 rounded-lg"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Desktop Actions */}
            <motion.div 
              className="hidden md:flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Enhanced Primary Actions Group */}
              <motion.div 
                className="flex items-center gap-1 bg-gradient-to-r from-muted/30 via-muted/40 to-muted/30 backdrop-blur-md rounded-xl p-1.5 border border-border/30 shadow-lg"
                whileHover={{ scale: 1.01, y: -1, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowAddStream(true)}
                    size="sm"
                    className="h-8 px-3 font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 border-0 shadow-md"
                    disabled={streams.length >= 16}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-1.5">Add</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 hover:bg-background/60 rounded-lg"
                    onClick={() => setShowDiscovery(true)}
                  >
                    <Compass className="h-4 w-4" />
                    <span className="ml-1.5">Discover</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={showChat ? "default" : "ghost"}
                    size="sm"
                    onClick={onToggleChat}
                    className={cn(
                      "h-8 px-3 rounded-lg",
                      showChat 
                        ? "bg-gradient-to-r from-primary to-primary/90 border-0" 
                        : "hover:bg-background/60"
                    )}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="ml-1.5">Chat</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Navigation Links */}
              <motion.div 
                className="flex items-center gap-1 bg-gradient-to-r from-muted/20 via-muted/25 to-muted/20 backdrop-blur-sm rounded-lg p-1 border border-border/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <Link href="/amp-summer">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-yellow-600 hover:bg-yellow-500/10"
                    >
                      <Zap className="h-4 w-4" />
                      <span className="ml-1.5">AMP</span>
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/blog">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      <span className="ml-1.5">Blog</span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Controls Group */}
              <motion.div 
                className="flex items-center gap-1 bg-gradient-to-r from-muted/35 via-muted/40 to-muted/35 backdrop-blur-sm rounded-lg p-1 border border-border/25 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <EnhancedLayoutSelector />
                <SavedLayoutsDialog />
                <ShareDialog />
                
                <AnimatePresence>
                  {streams.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowClearConfirm(true)}
                        className="h-8 px-3 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                        <span className="ml-1.5">Clear ({streams.length})</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Separator orientation="vertical" className="h-6 opacity-50" />

              {/* User Actions */}
              <motion.div 
                className="flex items-center gap-2 bg-gradient-to-r from-muted/25 to-muted/30 backdrop-blur-sm rounded-lg p-1.5 border border-border/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <ThemeToggle />

                {isSignedIn ? (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <UserButton afterSignOutUrl="/" />
                  </motion.div>
                ) : (
                  <div className="flex gap-1.5">
                    <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-3"
                          onClick={() => console.log('Sign In button clicked')}
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="ml-1.5">Sign In</span>
                        </Button>
                      </motion.div>
                    </SignInButton>
                    <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-8 px-3 shadow-sm"
                          onClick={() => console.log('Sign Up button clicked')}
                        >
                          <span>Sign Up</span>
                        </Button>
                      </motion.div>
                    </SignUpButton>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400,
                opacity: { duration: 0.2 }
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-border/50 z-50 md:hidden shadow-2xl"
            >
              <motion.div 
                className="flex items-center justify-between p-4 border-b border-border/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Menu
                </h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileMenu(false)}
                    className="h-8 w-8 p-0 hover:bg-muted/60"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="p-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {/* Stream Count */}
                <motion.div 
                  className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="text-sm text-muted-foreground">Active Streams</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {streams.length} / 16
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      onToggleChat()
                      setShowMobileMenu(false)
                    }}
                    variant={showChat ? "default" : "outline"}
                    className="w-full justify-start h-12"
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    {showChat ? 'Hide Chat' : 'Show Chat'}
                  </Button>

                  <Link href="/amp-summer" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Zap className="mr-3 h-5 w-5 text-yellow-600" />
                      AMP Summer
                    </Button>
                  </Link>

                  <Link href="/blog" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <BookmarkPlus className="mr-3 h-5 w-5" />
                      Blog
                    </Button>
                  </Link>
                </motion.div>

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
                      className="w-full justify-start h-12"
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
                          className="h-9"
                          onClick={() => console.log('Mobile Sign In button clicked')}
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="ml-2">Sign In</span>
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-9"
                          onClick={() => console.log('Mobile Sign Up button clicked')}
                        >
                          <span>Sign Up</span>
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <EnhancedAddStreamDialog 
        open={showAddStream} 
        onOpenChange={setShowAddStream} 
      />
      
      <DiscoverPopup 
        open={showDiscovery} 
        onOpenChange={setShowDiscovery} 
      />

      {/* Clear Streams Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clear All Streams</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to remove all {streams.length} stream{streams.length !== 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  clearAllStreams()
                  setShowClearConfirm(false)
                  trackFeatureUsage('clear_all_streams_confirmed')
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
})

export default Header