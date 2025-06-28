'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStreamStore } from '@/store/streamStore'
import { MessageSquare, X } from 'lucide-react'
import { Button } from './ui/button'

interface StreamChatProps {
  show: boolean
  onClose: () => void
}

export default function StreamChat({ show, onClose }: StreamChatProps) {
  const { streams } = useStreamStore()
  
  if (!show) return null
  
  const twitchStreams = streams.filter(s => s.platform === 'twitch')
  
  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-80 bg-background border-l z-50 flex flex-col">
      <div className="p-3 sm:p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <h3 className="font-semibold">Stream Chats</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </div>
      
      {twitchStreams.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
          <div>
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>No Twitch streams active</p>
            <p className="text-sm mt-2">Chat is only available for Twitch streams</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue={twitchStreams[0]?.id} className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none">
            {twitchStreams.map(stream => (
              <TabsTrigger 
                key={stream.id} 
                value={stream.id}
                className="flex-1 text-xs"
              >
                {stream.channelName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {twitchStreams.map(stream => (
            <TabsContent 
              key={stream.id} 
              value={stream.id} 
              className="flex-1 m-0"
            >
              <iframe
                src={`https://www.twitch.tv/embed/${stream.channelName}/chat?parent=${window.location.hostname}&parent=localhost&darkpopout`}
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}