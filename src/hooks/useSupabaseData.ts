'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import type { Database } from '@/lib/supabase'

type SavedLayout = Database['public']['Tables']['saved_layouts']['Row']
type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Product = Database['public']['Tables']['products']['Row']

export function useSavedLayouts() {
  const { profile } = useSupabase()
  const [layouts, setLayouts] = useState<SavedLayout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLayouts = async () => {
    if (!profile) return

    try {
      const response = await fetch('/api/layouts/get')
      if (!response.ok) throw new Error('Failed to fetch layouts')
      
      const data = await response.json()
      setLayouts(data.layouts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch layouts')
    } finally {
      setIsLoading(false)
    }
  }

  const saveLayout = async (name: string, layoutData: any, isDefault = false) => {
    if (!profile) return

    try {
      const response = await fetch('/api/layouts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, layoutData, isDefault })
      })
      
      if (!response.ok) throw new Error('Failed to save layout')
      
      const data = await response.json()
      if (data.layout) {
        setLayouts(prev => [data.layout, ...prev])
      }
      return data.layout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save layout')
      throw err
    }
  }

  const deleteLayout = async (layoutId: string) => {
    try {
      const response = await fetch('/api/layouts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutId })
      })
      
      if (!response.ok) throw new Error('Failed to delete layout')
      
      setLayouts(prev => prev.filter(layout => layout.id !== layoutId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete layout')
      throw err
    }
  }

  const setDefaultLayout = async (layoutId: string) => {
    if (!profile) return

    try {
      const response = await fetch('/api/layouts/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutId })
      })
      
      if (!response.ok) throw new Error('Failed to set default layout')
      
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
  const { profile } = useSupabase()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = async () => {
    if (!profile) return

    try {
      const response = await fetch('/api/preferences/get')
      if (!response.ok) throw new Error('Failed to fetch preferences')
      
      const data = await response.json()
      setPreferences(data.preferences || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: any) => {
    if (!profile) return

    try {
      const response = await fetch('/api/preferences/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: newPreferences })
      })
      
      if (!response.ok) throw new Error('Failed to update preferences')
      
      const data = await response.json()
      setPreferences(data.preferences)
      return data.preferences
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
  const { profile } = useSupabase()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    if (!profile) return

    try {
      const response = await fetch('/api/subscription/get-active')
      if (!response.ok) throw new Error('Failed to fetch subscription')
      
      const data = await response.json()
      setSubscription(data.subscription || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [profile])

  const hasFeature = (feature: string) => {
    if (!subscription) return false
    // For now, return true for any feature if user has active subscription
    // This can be expanded to check specific features based on subscription type
    return subscription.status === 'active' || subscription.status === 'trialing'
  }

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    hasActiveSubscription: subscription?.status === 'active' || subscription?.status === 'trialing',
    hasFeature,
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/get')
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data.products || [])
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