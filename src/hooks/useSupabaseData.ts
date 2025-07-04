'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import type { Database } from '@/lib/supabase'

type SavedLayout = Database['public']['Tables']['saved_layouts']['Row']
type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Product = Database['public']['Tables']['products']['Row']

export function useSavedLayouts() {
  const { supabase, profile } = useSupabase()
  const [layouts, setLayouts] = useState<SavedLayout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLayouts = async () => {
    if (!profile || !supabase) return

    try {
      const { data, error } = await supabase
        .from('saved_layouts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLayouts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch layouts')
    } finally {
      setIsLoading(false)
    }
  }

  const saveLayout = async (name: string, layoutData: any, isDefault = false) => {
    if (!profile || !supabase) return

    try {
      if (isDefault) {
        await supabase
          .from('saved_layouts')
          .update({ is_default: false })
          .eq('user_id', profile.id)
      }

      const { data, error } = await supabase
        .from('saved_layouts')
        .insert({
          user_id: profile.id,
          name,
          layout_data: layoutData,
          is_default: isDefault,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setLayouts(prev => [data, ...prev])
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save layout')
      throw err
    }
  }

  const deleteLayout = async (layoutId: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('saved_layouts')
        .delete()
        .eq('id', layoutId)

      if (error) throw error
      setLayouts(prev => prev.filter(layout => layout.id !== layoutId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete layout')
      throw err
    }
  }

  const setDefaultLayout = async (layoutId: string) => {
    if (!profile || !supabase) return

    try {
      await supabase
        .from('saved_layouts')
        .update({ is_default: false })
        .eq('user_id', profile.id)

      const { error } = await supabase
        .from('saved_layouts')
        .update({ is_default: true })
        .eq('id', layoutId)

      if (error) throw error
      setLayouts(prev => prev.map(layout => ({
        ...layout,
        is_default: layout.id === layoutId
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default layout')
      throw err
    }
  }

  useEffect(() => {
    fetchLayouts()
  }, [profile])

  return {
    layouts,
    isLoading,
    error,
    saveLayout,
    deleteLayout,
    setDefaultLayout,
    refetch: fetchLayouts,
  }
}

export function useUserPreferences() {
  const { supabase, profile } = useSupabase()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = async () => {
    if (!profile || !supabase) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', profile.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setPreferences(data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: any) => {
    if (!profile || !supabase) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: profile.id,
          preferences: newPreferences,
        })
        .select()
        .single()

      if (error) throw error
      setPreferences(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences')
      throw err
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [profile])

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  }
}

export function useSubscription() {
  const { supabase, profile } = useSupabase()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    if (!profile || !supabase) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, products(*)')
        .eq('user_id', profile.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setSubscription(data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [profile])

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    hasActiveSubscription: subscription?.status === 'active' || subscription?.status === 'trialing',
  }
}

export function useProducts() {
  const { supabase } = useSupabase()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('price_monthly', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  }
}