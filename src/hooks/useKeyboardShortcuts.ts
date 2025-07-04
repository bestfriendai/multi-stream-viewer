import { useHotkeys } from 'react-hotkeys-hook'
import { useStreamStore } from '@/store/streamStore'
import { toast } from 'sonner'

export function useKeyboardShortcuts() {
  const { 
    streams, 
    activeStreamId, 
    setActiveStream, 
    toggleStreamMute,
    setPrimaryStream,
    clearAllStreams
  } = useStreamStore()

  // Number keys 1-9 to switch streams
  for (let i = 1; i <= 9; i++) {
    useHotkeys(String(i), () => {
      const stream = streams[i - 1]
      if (stream) {
        setActiveStream(stream.id)
        setPrimaryStream(stream.id)
        toast.success(`Switched to ${stream.channelName}`)
      }
    })
  }

  // Space to toggle mute on active stream
  useHotkeys('space', (e) => {
    e.preventDefault()
    if (activeStreamId) {
      const stream = streams.find(s => s.id === activeStreamId)
      const wasMuted = stream?.muted
      toggleStreamMute(activeStreamId)
      if (stream) {
        toast.success(`${stream.channelName} ${wasMuted ? 'unmuted' : 'muted'}`)
      }
    }
  })

  // M to mute/unmute active stream
  useHotkeys('m', () => {
    if (activeStreamId) {
      const stream = streams.find(s => s.id === activeStreamId)
      const wasMuted = stream?.muted
      toggleStreamMute(activeStreamId)
      if (stream) {
        toast.success(`${stream.channelName} ${wasMuted ? 'unmuted' : 'muted'}`)
      }
    }
  })

  // F for fullscreen (to be implemented)
  useHotkeys('f', () => {
    if (activeStreamId) {
      // TODO: Implement fullscreen
      toast.info('Fullscreen coming soon!')
    }
  })

  // Arrow keys for navigation
  useHotkeys('arrowleft', () => {
    const currentIndex = streams.findIndex(s => s.id === activeStreamId)
    if (currentIndex > 0) {
      const prevStream = streams[currentIndex - 1]
      if (prevStream) {
        setActiveStream(prevStream.id)
        toast.success(`Switched to ${prevStream.channelName}`)
      }
    }
  })

  useHotkeys('arrowright', () => {
    const currentIndex = streams.findIndex(s => s.id === activeStreamId)
    if (currentIndex < streams.length - 1) {
      const nextStream = streams[currentIndex + 1]
      if (nextStream) {
        setActiveStream(nextStream.id)
        toast.success(`Switched to ${nextStream.channelName}`)
      }
    }
  })

  // Ctrl/Cmd + X to clear all streams
  useHotkeys('ctrl+x,cmd+x', () => {
    if (streams.length > 0) {
      clearAllStreams()
      toast.success('All streams cleared')
    }
  })

  // Show help with ?
  useHotkeys('shift+/', () => {
    toast.info(
      'Keyboard Shortcuts:\n' +
      '1-9: Switch to stream\n' +
      'Space/M: Mute/unmute\n' +
      '←→: Navigate streams\n' +
      'Ctrl+X: Clear all\n' +
      '?: Show this help',
      { duration: 5000 }
    )
  })
}