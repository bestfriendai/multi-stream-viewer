'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { useSubscription } from "@/hooks/useSubscription"
import { useTranslation } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { LogIn, Crown } from 'lucide-react'

export function UserAuth() {
  const { isSignedIn, isLoaded } = useUser()
  const { t, isLoaded: translationsLoaded } = useTranslation()
  const { isPro, isPremium, loading: subscriptionLoading } = useSubscription()

  if (!isLoaded || !translationsLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* Subscription Badge */}
        {!subscriptionLoading && (isPro || isPremium) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge 
              variant={isPremium ? "premium" : "gradient"}
              className="text-responsive-xs font-semibold"
            >
              <Crown className="h-3 w-3" />
              {isPremium ? "Premium" : "Pro"}
            </Badge>
          </motion.div>
        )}
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <UserButton />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex gap-1.5">
      <SignInButton mode="redirect" fallbackRedirectUrl="/">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3"
          >
            <LogIn className="h-4 w-4" />
            <span className="ml-1.5">{t('navigation.signIn')}</span>
          </Button>
        </motion.div>
      </SignInButton>
      <SignUpButton mode="redirect" fallbackRedirectUrl="/">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            size="sm"
            className="h-8 px-3 shadow-sm"
          >
            <span>{t('navigation.signUp')}</span>
          </Button>
        </motion.div>
      </SignUpButton>
    </div>
  )
}

export function MobileUserAuth() {
  const { isSignedIn, isLoaded } = useUser()
  const { isPro, isPremium, loading: subscriptionLoading } = useSubscription()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* Mobile Subscription Badge */}
        {!subscriptionLoading && (isPro || isPremium) && (
          <Badge 
            variant={isPremium ? "premium" : "gradient"}
            className="text-responsive-xs font-semibold"
          >
            <Crown className="h-3 w-3" />
            {isPremium ? "Premium" : "Pro"}
          </Badge>
        )}
        <UserButton />
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <SignInButton mode="redirect" fallbackRedirectUrl="/">
        <Button
          variant="outline"
          size="sm"
          className="h-9"
        >
          <LogIn className="h-4 w-4" />
          <span className="ml-2 text-responsive-sm">Sign In</span>
        </Button>
      </SignInButton>
      <SignUpButton mode="redirect" fallbackRedirectUrl="/">
        <Button
          variant="default"
          size="sm"
          className="h-9"
        >
          <span className="text-responsive-sm">Sign Up</span>
        </Button>
      </SignUpButton>
    </div>
  )
}