'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Keyboard,
  Share2,
  BookmarkPlus,
  MoreVertical,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import SavedLayoutsDialog from './SavedLayoutsDialog'
import ShareDialog from './ShareDialog'
import EnhancedLayoutSelector from './EnhancedLayoutSelector'
const EnhancedAddStreamDialog = dynamic(() => import('./EnhancedAddStreamDialog'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-32" />
})
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from 'next/dynamic'

const LiveDiscovery = dynamic(() => import('./LiveDiscovery'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-96" />
})
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
import { UserButton, useUser, useClerk } from "@clerk/nextjs"

interface HeaderProps {
  onToggleChat: () => void
  showChat: boolean
}

const Header = React.memo(function Header({ onToggleChat, showChat }: HeaderProps) {
  const [showAddStream, setShowAddStream] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const { 
    streams, 
    clearAllStreams
  } = useStreamStore()
  
  const { trackFeatureUsage, trackMenuItemClick } = useAnalytics()
  const { isSignedIn, user } = useUser()
  const { openSignIn, openSignUp } = useClerk()
  
  
  return (
    <div>
      <header className="bg-background/95 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <StreamyyyLogo size="sm" variant="gradient" />
            </Link>

            {/* Mobile Primary Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                onClick={() => setShowAddStream(true)}
                size="sm"
                className="h-9 px-3"
                disabled={streams.length >= 16}
              >
                <Plus className="h-4 w-4" />
                <span className="ml-1.5">Add</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3"
                onClick={() => setShowDiscovery(true)}
              >
                <Compass className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => setShowAddStream(true)}
                size="sm"
                className="h-9"
                disabled={streams.length >= 16}
              >
                <Plus className="h-4 w-4" />
                <span className="ml-2">Add Stream</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => setShowDiscovery(true)}
              >
                <Compass className="h-4 w-4" />
                <span className="ml-2">Discover</span>
              </Button>

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

              <Button
                variant={showChat ? "default" : "ghost"}
                size="sm"
                onClick={onToggleChat}
                className="h-9"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="ml-2">Chat</span>
              </Button>

              <ThemeToggle />

              <Separator orientation="vertical" className="h-6" />

              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    onClick={() => openSignIn()}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="ml-2">Sign In</span>
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    onClick={() => openSignUp()}
                  >
                    <span>Sign Up</span>
                  </Button>
                </div>
              )}
            </div>
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
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="h-8 w-8 p-0"
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9"
                        onClick={() => openSignIn()}
                      >
                        <LogIn className="h-4 w-4" />
                        <span className="ml-2">Sign In</span>
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-9"
                        onClick={() => openSignUp()}
                      >
                        <span>Sign Up</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default Header