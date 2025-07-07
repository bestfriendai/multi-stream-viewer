'use client'

import { useState } from 'react'
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Bug, MessageSquare } from 'lucide-react'

export default function SentryTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testError = () => {
    try {
      throw new Error("Test error from multi-stream-viewer - This is intentional for testing!")
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test: true,
          component: "SentryTestPage",
          type: "manual_error"
        },
        extra: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          page: window.location.href
        }
      })
      addResult("✅ Test error sent to Sentry successfully")
    }
  }

  const testMessage = () => {
    Sentry.captureMessage("Test message from multi-stream-viewer Sentry integration", {
      level: "info",
      tags: {
        test: true,
        component: "SentryTestPage",
        type: "manual_message"
      }
    })
    addResult("✅ Test message sent to Sentry successfully")
  }

  const testBreadcrumb = () => {
    Sentry.addBreadcrumb({
      message: "User performed test action",
      category: "user",
      level: "info",
      data: {
        action: "test_breadcrumb",
        timestamp: new Date().toISOString()
      }
    })
    addResult("✅ Test breadcrumb added to Sentry")
  }

  const testUserContext = () => {
    Sentry.setUser({
      id: "test-user-123",
      email: "test@example.com",
      username: "test-user"
    })
    addResult("✅ Test user context set in Sentry")
  }

  const testPerformance = () => {
    // Use the modern Sentry SDK approach
    Sentry.withActiveSpan(null, () => {
      const transaction = Sentry.startInactiveSpan({
        name: "Test Performance Transaction",
        op: "test"
      })
      
      // Simulate some work
      setTimeout(() => {
        const span = Sentry.startInactiveSpan({
          name: "test_operation",
          op: "test_operation"
        })
        
        setTimeout(() => {
          span.end()
          transaction.end()
          addResult("✅ Test performance transaction sent to Sentry")
        }, 100)
      }, 50)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sentry Integration Test</h1>
        <p className="text-muted-foreground">
          Test various Sentry features to ensure proper integration with the multi-stream-viewer application.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Tracking
            </CardTitle>
            <CardDescription>
              Test error capture and exception handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testError} variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4 mr-2" />
              Test Error Capture
            </Button>
            <Button onClick={testBreadcrumb} variant="outline" className="w-full">
              Test Breadcrumb Tracking
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message Logging
            </CardTitle>
            <CardDescription>
              Test message capture and user context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testMessage} variant="secondary" className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Test Message Capture
            </Button>
            <Button onClick={testUserContext} variant="outline" className="w-full">
              Test User Context
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Monitoring</CardTitle>
            <CardDescription>
              Test performance tracking and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testPerformance} variant="outline" className="w-full">
              Test Performance Transaction
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentry Configuration</CardTitle>
            <CardDescription>
              Current Sentry project details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Project:</strong> multi-stream-viewer</div>
            <div><strong>Organization:</strong> block-browser</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div className="text-green-600">✅ Sentry SDK Loaded</div>
          </CardContent>
        </Card>
      </div>

      {testResults.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from Sentry integration tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded text-sm font-mono"
                >
                  {result}
                </div>
              ))}
            </div>
            <Button
              onClick={() => setTestResults([])}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Clear Results
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8 border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                How to View Test Results in Sentry
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Go to <a href="https://block-browser.sentry.io/projects/multi-stream-viewer/" className="underline" target="_blank" rel="noopener noreferrer">your Sentry project dashboard</a></li>
                <li>Click on "Issues" to see captured errors</li>
                <li>Click on "Performance" to view performance transactions</li>
                <li>Use the "test: true" tag to filter test events</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}