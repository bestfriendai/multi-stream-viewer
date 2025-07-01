import TwitchTestPanel from '@/components/TwitchTestPanel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TestTwitchPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Twitch API Integration Test</h1>
        
        <TwitchTestPanel />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Test Information:</h2>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• This page tests all Twitch API integrations</li>
            <li>• Environment variables are checked from server-side</li>
            <li>• API calls test token generation and data fetching</li>
            <li>• UI components test real-time status updates</li>
            <li>• The status refreshes every 60 seconds automatically</li>
          </ul>
        </div>
      </div>
    </div>
  )
}