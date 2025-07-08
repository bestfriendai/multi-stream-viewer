'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'

export default function SentryTestButton() {
  const [status, setStatus] = useState('')

  const testSentryCapture = () => {
    try {
      // Test different types of Sentry capture
      console.log('🧪 Testing Sentry capture...')
      
      // 1. Capture a test message
      Sentry.captureMessage('Sentry Test: Manual message capture', 'info')
      
      // 2. Capture a test error
      const testError = new Error('Sentry Test: This is a test error from the frontend')
      Sentry.captureException(testError)
      
      // 3. Add a breadcrumb
      Sentry.addBreadcrumb({
        message: 'Sentry Test: User clicked test button',
        level: 'info',
        category: 'user_action',
      })
      
      // 4. Set user context
      Sentry.setUser({
        id: 'test_user_123',
        email: 'test@example.com',
        username: 'SentryTester',
      })
      
      // 5. Set custom tags
      Sentry.setTag('test_session', 'manual_test')
      Sentry.setTag('component', 'SentryTestButton')
      
      // 6. Set extra context
      Sentry.setExtra('test_data', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
      
      // 7. Test performance monitoring
      Sentry.startSpan({
        name: 'sentry_test_transaction',
        op: 'manual_test',
      }, (span) => {
        // Simulate some work
        setTimeout(() => {
          span?.setStatus('ok')
        }, 100)
      })
      
      setStatus('✅ Sentry test events sent! Check your Sentry dashboard.')
      console.log('✅ All Sentry test events sent successfully')
      
    } catch (error) {
      console.error('❌ Sentry test failed:', error)
      setStatus('❌ Sentry test failed. Check console for details.')
    }
  }

  const testSentryFeedback = () => {
    try {
      const feedbackIntegration = Sentry.getFeedback()
      if (feedbackIntegration) {
        feedbackIntegration.openDialog()
        setStatus('📝 Sentry feedback dialog opened')
      } else {
        setStatus('❌ Sentry feedback not available')
      }
    } catch (error) {
      console.error('❌ Sentry feedback test failed:', error)
      setStatus('❌ Sentry feedback test failed')
    }
  }

  return (
    <div className="p-4 space-y-4 bg-background/50 rounded-lg border">
      <h3 className="text-lg font-semibold">🐛 Sentry Debug Tools</h3>
      <p className="text-sm text-muted-foreground">
        Test if Sentry is properly capturing events and traces.
      </p>
      
      <div className="flex gap-2">
        <Button onClick={testSentryCapture} variant="outline" size="sm">
          🧪 Test Sentry Capture
        </Button>
        <Button onClick={testSentryFeedback} variant="outline" size="sm">
          📝 Test Feedback
        </Button>
      </div>
      
      {status && (
        <div className="p-3 text-sm bg-muted rounded">
          {status}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>DSN:</strong> {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Configured' : '❌ Missing'}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Debug Mode:</strong> {process.env.NODE_ENV === 'development' ? '✅ Enabled' : '❌ Disabled'}</p>
      </div>
    </div>
  )
}