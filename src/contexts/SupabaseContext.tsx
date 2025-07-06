'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import type { Database } from '@/lib/supabase'

interface SupabaseContextType {
  profile: Database['public']['Tables']['profiles']['Row'] | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const createOrUpdateProfile = async () => {
    if (!user) return
    
    try {
      // Use API route instead of direct Supabase call
      const response = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Error syncing profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    
    try {
      // Use API route instead of direct Supabase call
      const response = await fetch('/api/profile/get');
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Error fetching profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  useEffect(() => {
    if (isSignedIn && user) {
      createOrUpdateProfile()
    } else {
      setProfile(null)
      setIsLoading(false)
    }
  }, [isSignedIn, user])

  return (
    <SupabaseContext.Provider
      value={{
        profile,
        isLoading,
        refreshProfile,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}