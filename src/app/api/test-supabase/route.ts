import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    // Test 1: Basic Supabase connection
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (productsError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: productsError.message
      }, { status: 500 })
    }

    // Test 2: Clerk authentication
    const { userId, getToken } = await auth()

    // Test 3: Clerk token generation
    let tokenTest = null
    if (userId) {
      try {
        const token = await getToken()
        tokenTest = {
          success: !!token,
          hasToken: !!token,
          tokenLength: token?.length || 0
        }
      } catch (error) {
        tokenTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Token generation failed'
        }
      }
    }

    // Test 4: Authenticated Supabase query with Clerk token
    let profileTest = null
    if (userId && tokenTest?.success) {
      try {
        const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          async accessToken() {
            return getToken()
          },
        })

        const { data: profile, error: profileError } = await authenticatedSupabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', userId)
          .single()

        profileTest = {
          success: !profileError,
          error: profileError?.message,
          hasProfile: !!profile,
          profileData: profile ? { id: profile.id, email: profile.email } : null
        }
      } catch (error) {
        profileTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Profile query failed'
        }
      }
    }

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        nodeEnv: process.env.NODE_ENV
      },
      tests: {
        supabaseConnection: {
          success: true,
          productsFound: products?.length || 0
        },
        clerkAuth: {
          success: !!userId,
          userId: userId || null
        },
        clerkToken: tokenTest,
        profileQuery: profileTest
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
