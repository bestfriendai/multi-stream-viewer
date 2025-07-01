'use client'

import { useState, useEffect } from 'react'
import { useTwitchStatus } from '@/hooks/useTwitchStatus'
import LiveIndicator from './LiveIndicator'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export default function TwitchTestPanel() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  // Test channels - mix of usually live and offline
  const testChannels = ['ninja', 'shroud', 'pokimane', 'lirik', 'summit1g']
  const [enableStatus, setEnableStatus] = useState(false)
  
  // Delay enabling status check to prevent immediate API calls
  useEffect(() => {
    const timer = setTimeout(() => setEnableStatus(true), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  const { status, loading: statusLoading, error: statusError } = useTwitchStatus(
    testChannels,
    { enabled: enableStatus, refreshInterval: 180000 } // 3 minutes for test panel
  )

  const runApiTests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-twitch')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ status: 'error', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Twitch API Integration Test
            <Button 
              onClick={runApiTests} 
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {testResults.status === 'success' ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <span className="font-medium">
                  {testResults.status === 'success' ? 'All tests passed!' : 'Some tests failed'}
                </span>
              </div>

              {testResults.tests && (
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Environment:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Client ID: {testResults.tests.environment.clientId ? '✓' : '✗'}</li>
                      <li>Client Secret: {testResults.tests.environment.clientSecret ? '✓' : '✗'}</li>
                      <li>Redirect URI: {testResults.tests.environment.redirectUri || 'Not set'}</li>
                    </ul>
                  </div>

                  <div>
                    <strong>Token:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Generated: {testResults.tests.token?.success ? '✓' : '✗'}</li>
                      <li>Valid: {testResults.tests.token?.isValid ? '✓' : '✗'}</li>
                    </ul>
                  </div>

                  <div>
                    <strong>API Calls:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Top Games: {testResults.tests.apiCalls.topStreams?.success ? '✓' : '✗'}</li>
                      <li>Stream Status: {testResults.tests.apiCalls.specificStreams?.success ? '✓' : '✗'}</li>
                      <li>Search: {testResults.tests.apiCalls.searchChannels?.success ? '✓' : '✗'}</li>
                    </ul>
                  </div>

                  {testResults.tests.errors.length > 0 && (
                    <div className="text-red-600">
                      <strong>Errors:</strong>
                      <ul className="ml-4 mt-1">
                        {testResults.tests.errors.map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Status Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusLoading && <p>Loading stream status...</p>}
            {statusError && <p className="text-red-600">Error: {statusError.message}</p>}
            
            {testChannels.map(channel => {
              const streamStatus = status.get(channel)
              return (
                <div key={channel} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <span className="font-medium">{channel}</span>
                  <div className="flex items-center gap-2">
                    {streamStatus ? (
                      <>
                        <LiveIndicator 
                          isLive={streamStatus.isLive} 
                          viewerCount={streamStatus.viewerCount}
                          size="sm"
                        />
                        {streamStatus.isLive && streamStatus.gameName && (
                          <span className="text-sm text-muted-foreground">
                            Playing {streamStatus.gameName}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}