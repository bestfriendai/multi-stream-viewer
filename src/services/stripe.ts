import { Product } from '@/types'

/**
 * Stripe service layer for handling all Stripe-related API calls
 * This centralizes Stripe operations and provides consistent error handling
 */

export interface CheckoutSessionResponse {
  url: string
  sessionId: string
}

export interface StripeError extends Error {
  code?: string
  statusCode?: number
}

/**
 * Creates a Stripe checkout session
 * @param priceId - Stripe price ID
 * @param productId - Product identifier
 * @returns Promise<CheckoutSessionResponse>
 * @throws StripeError
 */
export async function createCheckoutSession(
  priceId: string, 
  productId: string
): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch('/api/stripe/checkout/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, productId }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to create checkout session') as StripeError
      error.statusCode = response.status
      error.code = data.code
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred while creating checkout session')
  }
}

/**
 * Creates a customer portal session for subscription management
 * @returns Promise<{ url: string }>
 * @throws StripeError
 */
export async function createPortalSession(): Promise<{ url: string }> {
  try {
    const response = await fetch('/api/stripe/portal/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to create portal session') as StripeError
      error.statusCode = response.status
      error.code = data.code
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred while creating portal session')
  }
}

/**
 * Fetches all available products from Stripe
 * @returns Promise<Product[]>
 * @throws StripeError
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/stripe/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch products') as StripeError
      error.statusCode = response.status
      error.code = data.code
      throw error
    }

    return data.products || []
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred while fetching products')
  }
}

/**
 * Triggers auto-sync for subscriptions
 * @param force - Whether to force sync regardless of cache
 * @returns Promise<{ success: boolean; message: string }>
 * @throws StripeError
 */
export async function triggerAutoSync(force: boolean = false): Promise<{
  success: boolean
  message: string
  synced?: number
  errors?: string[]
}> {
  try {
    const response = await fetch('/api/stripe/auto-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ force }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Auto-sync failed') as StripeError
      error.statusCode = response.status
      error.code = data.code
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred during auto-sync')
  }
}

/**
 * Gets sync status
 * @returns Promise<{ success: boolean; status: any }>
 * @throws StripeError
 */
export async function getSyncStatus(): Promise<{
  success: boolean
  status: any
  message: string
}> {
  try {
    const response = await fetch('/api/stripe/auto-sync', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to get sync status') as StripeError
      error.statusCode = response.status
      error.code = data.code
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred while getting sync status')
  }
}

/**
 * Validates a Stripe price ID format
 * @param priceId - Price ID to validate
 * @returns boolean
 */
export function isValidPriceId(priceId: string): boolean {
  return /^price_[a-zA-Z0-9]{24,}$/.test(priceId)
}

/**
 * Validates a Stripe product ID format
 * @param productId - Product ID to validate
 * @returns boolean
 */
export function isValidProductId(productId: string): boolean {
  return /^prod_[a-zA-Z0-9]{14,}$/.test(productId)
}

/**
 * Stripe service object with all methods
 */
export const stripeService = {
  createCheckoutSession,
  createPortalSession,
  fetchProducts,
  triggerAutoSync,
  getSyncStatus,
  isValidPriceId,
  isValidProductId,
}