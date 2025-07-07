'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryExamplePage() {
  const [testResult, setTestResult] = useState<string>('')
  
  // Get logger from Sentry
  const { logger } = Sentry

  const triggerTestError = () => {
    try {
      // This will throw an error to test Sentry
      myUndefinedFunction()
    } catch (error) {
      Sentry.captureException(error)
      setTestResult('Test error sent to Sentry!')
    }
  }

  const triggerTestSpan = () => {
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click",
      },
      (span) => {
        const config = "test-configuration"
        const metric = 42

        // Add metrics to the span
        span.setAttribute("config", config)
        span.setAttribute("metric", metric)

        // Simulate some work
        setTimeout(() => {
          setTestResult('Test span created successfully!')
        }, 100)
      }
    )
  }

  const triggerTestLogs = () => {
    logger.trace("Starting test operation", { component: "SentryExamplePage" })
    logger.debug(logger.fmt`Testing debug log with value: ${42}`)
    logger.info("Test operation completed", { success: true })
    logger.warn("This is a test warning", { warningType: "test" })
    logger.error("This is a test error log", { errorType: "test" })
    
    setTestResult('Test logs sent to Sentry!')
  }

  const triggerAPISpan = async () => {
    await Sentry.startSpan(
      {
        op: "http.client",
        name: "GET /api/health",
      },
      async () => {
        try {
          const response = await fetch('/api/health')
          const data = await response.json()
          setTestResult(`API test completed: ${JSON.stringify(data)}`)
        } catch (error) {
          Sentry.captureException(error)
          setTestResult('API test failed - error sent to Sentry!')
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🔍 Sentry Test Page
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Sentry Features</h2>
          <p className="text-gray-300 mb-6">
            This page allows you to test various Sentry features including error tracking, 
            performance monitoring, and logging.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={triggerTestError}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🚨 Test Error Tracking
            </button>
            
            <button
              onClick={triggerTestSpan}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📊 Test Performance Span
            </button>
            
            <button
              onClick={triggerTestLogs}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📝 Test Logging
            </button>
            
            <button
              onClick={triggerAPISpan}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🌐 Test API Span
            </button>
          </div>
          
          {testResult && (
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <p className="text-green-400">{testResult}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Sentry Configuration Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>DSN:</span>
              <span className="text-green-400">✅ Configured</span>
            </div>
            <div className="flex justify-between">
              <span>Error Tracking:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Performance Monitoring:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Session Replay:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Logging:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime Monitoring:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Cron Monitoring:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Attachments:</span>
              <span className="text-green-400">✅ Active</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400">
          <p>Check your Sentry dashboard to see the captured events!</p>
          <p className="text-sm mt-2">
            Project: <code>javascript-nextjs</code> | Org: <code>block-browser</code>
          </p>
        </div>
      </div>
    </div>
  )
}

// This function doesn't exist and will cause an error when called
declare function myUndefinedFunction(): void