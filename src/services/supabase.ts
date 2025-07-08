import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Supabase service layer for handling all database operations
 * This centralizes database calls and provides consistent error handling
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export interface SupabaseError extends Error {
  code?: string
  statusCode?: number
}

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SavedLayout = Database['public']['Tables']['saved_layouts']['Row']

/**
 * Profile operations
 */
export const profileService = {
  /**
   * Gets a user profile by ID
   * @param userId - User ID
   * @returns Promise<Profile | null>
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to get profile: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Profile service error:', error)
      throw error
    }
  },

  /**
   * Creates or updates a user profile
   * @param profile - Profile data
   * @returns Promise<Profile>
   */
  async upsertProfile(profile: ProfileInsert): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to upsert profile: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Profile upsert error:', error)
      throw error
    }
  },

  /**
   * Updates a user profile (selective updates only)
   * @param userId - User ID
   * @param updates - Partial profile updates
   * @returns Promise<Profile>
   */
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  },

  /**
   * Deletes a user profile
   * @param userId - User ID
   * @returns Promise<void>
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        throw new Error(`Failed to delete profile: ${error.message}`)
      }
    } catch (error) {
      console.error('Profile delete error:', error)
      throw error
    }
  }
}

/**
 * Product operations
 */
export const productService = {
  /**
   * Gets all products
   * @returns Promise<Product[]>
   */
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('metadata->priority', { ascending: true })

      if (error) {
        throw new Error(`Failed to get products: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Product service error:', error)
      throw error
    }
  },

  /**
   * Gets a specific product by ID
   * @param productId - Product ID
   * @returns Promise<Product | null>
   */
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to get product: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Product get error:', error)
      throw error
    }
  }
}

/**
 * Subscription operations
 */
export const subscriptionService = {
  /**
   * Gets user subscription
   * @param userId - User ID
   * @returns Promise<Subscription | null>
   */
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to get subscription: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Subscription service error:', error)
      throw error
    }
  },

  /**
   * Creates or updates a subscription
   * @param subscription - Subscription data
   * @returns Promise<Subscription>
   */
  async upsertSubscription(subscription: any): Promise<Subscription> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert(subscription, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to upsert subscription: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Subscription upsert error:', error)
      throw error
    }
  },

  /**
   * Cancels a subscription
   * @param subscriptionId - Subscription ID
   * @returns Promise<void>
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) {
        throw new Error(`Failed to cancel subscription: ${error.message}`)
      }
    } catch (error) {
      console.error('Subscription cancel error:', error)
      throw error
    }
  }
}

/**
 * Saved layouts operations
 */
export const layoutService = {
  /**
   * Gets user's saved layouts
   * @param userId - User ID
   * @returns Promise<SavedLayout[]>
   */
  async getUserLayouts(userId: string): Promise<SavedLayout[]> {
    try {
      const { data, error } = await supabase
        .from('saved_layouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get layouts: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Layout service error:', error)
      throw error
    }
  },

  /**
   * Saves a new layout
   * @param layout - Layout data
   * @returns Promise<SavedLayout>
   */
  async saveLayout(layout: any): Promise<SavedLayout> {
    try {
      const { data, error } = await supabase
        .from('saved_layouts')
        .insert(layout)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save layout: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Layout save error:', error)
      throw error
    }
  },

  /**
   * Deletes a saved layout
   * @param layoutId - Layout ID
   * @param userId - User ID (for security)
   * @returns Promise<void>
   */
  async deleteLayout(layoutId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_layouts')
        .delete()
        .eq('id', layoutId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to delete layout: ${error.message}`)
      }
    } catch (error) {
      console.error('Layout delete error:', error)
      throw error
    }
  }
}

/**
 * General database utilities
 */
export const dbUtils = {
  /**
   * Executes a database transaction
   * @param operations - Array of database operations
   * @returns Promise<any>
   */
  async executeTransaction(operations: (() => Promise<any>)[]): Promise<any> {
    try {
      // Note: Supabase doesn't have explicit transaction support in the client
      // For complex transactions, this should be moved to a database function
      const results = []
      for (const operation of operations) {
        const result = await operation()
        results.push(result)
      }
      return results
    } catch (error) {
      console.error('Transaction error:', error)
      throw error
    }
  },

  /**
   * Health check for database connection
   * @returns Promise<boolean>
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      return !error
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }
}

/**
 * Combined service object
 */
export const supabaseService = {
  profile: profileService,
  product: productService,
  subscription: subscriptionService,
  layout: layoutService,
  utils: dbUtils,
  client: supabase
}