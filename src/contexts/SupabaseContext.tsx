'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'

interface SupabaseContextType {
  supabase: SupabaseClient<Database> | null
  profile: Database['public']['Tables']['profiles']['Row'] | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create Supabase client with Clerk integration using the new native approach
  useEffect(() => {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      async accessToken() {
        return getToken() ?? null
      },
    })

    setSupabase(client as any)
  }, [getToken])

  const getSupabaseWithAuth = async () => {
    return supabase
  }

  const createOrUpdateProfile = async () => {
    if (!user) return
    
    const client = await getSupabaseWithAuth()
    if (!client) return

    try {
      const { data: existingProfile } = await client
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()

      if (existingProfile) {
        const { data: updatedProfile } = await client
          .from('profiles')
          .update({
            email: user.emailAddresses[0]?.emailAddress || '',
            full_name: user.fullName || '',
            avatar_url: user.imageUrl || '',
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', user.id)
          .select()
          .single()

        if (updatedProfile) {
          setProfile(updatedProfile)
        }
      } else {
        const { data: newProfile } = await client
          .from('profiles')
          .insert({
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            full_name: user.fullName || '',
            avatar_url: user.imageUrl || '',
          })
          .select()
          .single()

        if (newProfile) {
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    
    const client = await getSupabaseWithAuth()
    if (!client) return

    try {
      const { data } = await client
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  useEffect(() => {
    if (isSignedIn && user && supabase) {
      createOrUpdateProfile()
    } else {
      setProfile(null)
      setIsLoading(false)
    }
  }, [isSignedIn, user, supabase])

  if (!supabase) {
    return null
  }

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
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