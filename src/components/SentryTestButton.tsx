'use client'

import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"

export default function SentryTestButton() {
  const testSentryError = () => {
    try {
      // Create a test error
      throw new Error("Test error for Sentry integration")
    } catch (error) {
      // Manually capture the error
      Sentry.captureException(error, {
        tags: {
          component: "SentryTestButton",
          test: true
        },
        extra: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      })
      
      console.log("Test error sent to Sentry!")
    }
  }

  const testSentryMessage = () => {
    Sentry.captureMessage("Test message from multi-stream-viewer", "info")
    console.log("Test message sent to Sentry!")
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={testSentryError}
        variant="destructive"
        size="sm"
      >
        Test Sentry Error
      </Button>
      <Button 
        onClick={testSentryMessage}
        variant="secondary"
        size="sm"
      >
        Test Sentry Message
      </Button>
    </div>
  )
}