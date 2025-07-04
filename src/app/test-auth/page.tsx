'use client'

import { useState } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const { user } = useUser()
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runAuthTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-auth-integration')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({
        success: false,
        error: 'Failed to run test',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setIsLoading(false)
  }

  const cleanupTestData = async () => {
    try {
      const response = await fetch('/api/test-auth-integration', { method: 'DELETE' })
      const data = await response.json()
      alert(data.message)
      setTestResults(null)
    } catch (error) {
      alert('Failed to cleanup test data')
    }
  }

  const getStatusIcon = (success: boolean) => success ? '✅' : '❌'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Authenticated Clerk + Supabase Test</h1>
          <p className="text-muted-foreground">
            This page tests the full authentication flow between Clerk and Supabase.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user authentication state</CardDescription>
          </CardHeader>
          <CardContent>
            <SignedOut>
              <div className="text-center space-y-4">
                <p>❌ Not signed in</p>
                <SignInButton>
                  <Button>Sign In to Test Integration</Button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">✅ Signed in as:</p>
                    <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                    <p className="text-xs text-muted-foreground">User ID: {user?.id}</p>
                  </div>
                  <UserButton />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={runAuthTest} disabled={isLoading}>
                    {isLoading ? 'Running Test...' : 'Test Clerk + Supabase Integration'}
                  </Button>
                  {testResults && (
                    <Button variant="outline" onClick={cleanupTestData}>
                      Cleanup Test Data
                    </Button>
                  )}
                </div>
              </div>
            </SignedIn>
          </CardContent>
        </Card>

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle>Integration Test Results</CardTitle>
              <CardDescription>
                Results of the Clerk + Supabase integration test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results:</h3>
                  {testResults.tests && (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Token Generation:</span>
                        <span>{getStatusIcon(testResults.tests.tokenGeneration?.success)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Products Query:</span>
                        <span>{getStatusIcon(testResults.tests.productsQuery?.success)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profile Query:</span>
                        <span>{getStatusIcon(testResults.tests.profileQuery?.success)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profile Creation:</span>
                        <span>{getStatusIcon(testResults.tests.profileCreation?.success)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Details:</h3>
                  <div className="text-sm space-y-1">
                    <div>User ID: {testResults.userId}</div>
                    {testResults.tests?.productsQuery?.count && (
                      <div>Products found: {testResults.tests.productsQuery.count}</div>
                    )}
                    {testResults.tests?.profileQuery?.data && (
                      <div>Profile exists: Yes</div>
                    )}
                  </div>
                </div>
              </div>

              {testResults.tests && Object.values(testResults.tests).some((test: any) => test.error) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                  <div className="space-y-1 text-sm text-red-700">
                    {Object.entries(testResults.tests).map(([testName, test]: [string, any]) => 
                      test.error && (
                        <div key={testName}>
                          <strong>{testName}:</strong> {test.error}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {testResults.success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 font-semibold">
                    🎉 Integration test completed successfully!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Clerk authentication and Supabase database integration are working properly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>What This Test Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Token Generation:</strong> Verifies Clerk can generate authentication tokens</li>
              <li><strong>Products Query:</strong> Tests basic Supabase connectivity with public data</li>
              <li><strong>Profile Query:</strong> Tests authenticated queries using Clerk tokens</li>
              <li><strong>Profile Creation:</strong> Tests authenticated data insertion with RLS policies</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
