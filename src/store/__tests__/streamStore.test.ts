import { renderHook, act } from '@testing-library/react'
import { useStreamStore } from '../streamStore'
import { createMockStream } from '../../../jest.setup'

// Mock parseStreamInput
jest.mock('@/lib/streamParser', () => ({
  parseStreamInput: jest.fn((input) => {
    if (typeof input === 'string' && input.includes('twitch.tv')) {
      return {
        channelName: input.split('/').pop(),
        platform: 'twitch',
        channelId: input.split('/').pop()
      }
    }
    return null
  })
}))

describe('useStreamStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStreamStore.getState().clearAllStreams()
    jest.clearAllMocks()
  })

  describe('addStream', () => {
    it('adds a valid stream successfully', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      const streamInput = {
        channelName: 'testchannel',
        platform: 'twitch' as const,
        channelId: 'testchannel'
      }

      await act(async () => {
        const success = await result.current.addStream(streamInput)
        expect(success).toBe(true)
      })

      expect(result.current.streams).toHaveLength(1)
      expect(result.current.streams[0].channelName).toBe('testchannel')
      expect(result.current.streams[0].platform).toBe('twitch')
    })

    it('handles legacy string input', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      await act(async () => {
        const success = await result.current.addStream('https://twitch.tv/testchannel')
        expect(success).toBe(true)
      })

      expect(result.current.streams).toHaveLength(1)
      expect(result.current.streams[0].channelName).toBe('testchannel')
    })

    it('prevents duplicate streams', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      const streamInput = {
        channelName: 'testchannel',
        platform: 'twitch' as const,
        channelId: 'testchannel'
      }

      await act(async () => {
        await result.current.addStream(streamInput)
        const secondAttempt = await result.current.addStream(streamInput)
        expect(secondAttempt).toBe(false)
      })

      expect(result.current.streams).toHaveLength(1)
      expect(result.current.error).toContain('already exists')
    })

    it('validates input correctly', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      await act(async () => {
        const success = await result.current.addStream({
          channelName: '', // Invalid empty name
          platform: 'twitch' as const
        })
        expect(success).toBe(false)
      })

      expect(result.current.streams).toHaveLength(0)
      expect(result.current.error).toContain('Invalid')
    })

    it('sets first stream as active and primary', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      const streamInput = {
        channelName: 'testchannel',
        platform: 'twitch' as const,
        channelId: 'testchannel'
      }

      await act(async () => {
        await result.current.addStream(streamInput)
      })

      expect(result.current.activeStreamId).toBe(result.current.streams[0].id)
      expect(result.current.primaryStreamId).toBe(result.current.streams[0].id)
    })
  })

  describe('removeStream', () => {
    it('removes stream successfully', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      // Add a stream first
      await act(async () => {
        await result.current.addStream({
          channelName: 'testchannel',
          platform: 'twitch' as const
        })
      })

      const streamId = result.current.streams[0].id

      await act(async () => {
        result.current.removeStream(streamId)
      })

      expect(result.current.streams).toHaveLength(0)
    })

    it('updates active stream when active stream is removed', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      // Add two streams
      await act(async () => {
        await result.current.addStream({
          channelName: 'channel1',
          platform: 'twitch' as const
        })
        await result.current.addStream({
          channelName: 'channel2',
          platform: 'twitch' as const
        })
      })

      const firstStreamId = result.current.streams[0].id

      await act(async () => {
        result.current.removeStream(firstStreamId)
      })

      expect(result.current.streams).toHaveLength(1)
      expect(result.current.activeStreamId).toBe(result.current.streams[0].id)
    })
  })

  describe('stream controls', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useStreamStore())
      
      await act(async () => {
        await result.current.addStream({
          channelName: 'testchannel',
          platform: 'twitch' as const
        })
      })
    })

    it('toggles stream mute correctly', () => {
      const { result } = renderHook(() => useStreamStore())
      const streamId = result.current.streams[0].id
      const initialMuteState = result.current.streams[0].muted

      act(() => {
        result.current.toggleStreamMute(streamId)
      })

      expect(result.current.streams[0].muted).toBe(!initialMuteState)
    })

    it('ensures only one stream is unmuted', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      // Add second stream
      await act(async () => {
        await result.current.addStream({
          channelName: 'channel2',
          platform: 'twitch' as const
        })
      })

      const [stream1, stream2] = result.current.streams

      // Unmute first stream
      act(() => {
        result.current.toggleStreamMute(stream1.id)
      })

      // Unmute second stream - should mute first
      act(() => {
        result.current.toggleStreamMute(stream2.id)
      })

      const updatedStreams = result.current.streams
      const updatedStream1 = updatedStreams.find(s => s.id === stream1.id)
      const updatedStream2 = updatedStreams.find(s => s.id === stream2.id)

      expect(updatedStream1?.muted).toBe(true)
      expect(updatedStream2?.muted).toBe(false)
    })

    it('sets stream quality correctly', () => {
      const { result } = renderHook(() => useStreamStore())
      const streamId = result.current.streams[0].id

      act(() => {
        result.current.setStreamQuality(streamId, '1080p')
      })

      expect(result.current.streams[0].quality).toBe('1080p')
    })

    it('sets stream volume correctly', () => {
      const { result } = renderHook(() => useStreamStore())
      const streamId = result.current.streams[0].id

      act(() => {
        result.current.setStreamVolume(streamId, 75)
      })

      expect(result.current.streams[0].volume).toBe(75)
    })

    it('validates volume range', () => {
      const { result } = renderHook(() => useStreamStore())
      const streamId = result.current.streams[0].id
      const initialVolume = result.current.streams[0].volume

      act(() => {
        result.current.setStreamVolume(streamId, 150) // Invalid volume
      })

      expect(result.current.streams[0].volume).toBe(initialVolume) // Should not change
    })
  })

  describe('layout management', () => {
    it('sets grid layout correctly', () => {
      const { result } = renderHook(() => useStreamStore())

      act(() => {
        result.current.setGridLayout('3x3')
      })

      expect(result.current.gridLayout).toBe('3x3')
    })

    it('sets primary stream correctly', () => {
      const { result } = renderHook(() => useStreamStore())

      act(() => {
        result.current.setPrimaryStream('test-stream-id')
      })

      expect(result.current.primaryStreamId).toBe('test-stream-id')
    })

    it('sets active stream correctly', () => {
      const { result } = renderHook(() => useStreamStore())

      act(() => {
        result.current.setActiveStream('test-stream-id')
      })

      expect(result.current.activeStreamId).toBe('test-stream-id')
    })
  })

  describe('stream reordering', () => {
    it('reorders streams correctly', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      // Add multiple streams
      await act(async () => {
        await result.current.addStream({
          channelName: 'channel1',
          platform: 'twitch' as const
        })
        await result.current.addStream({
          channelName: 'channel2',
          platform: 'twitch' as const
        })
        await result.current.addStream({
          channelName: 'channel3',
          platform: 'twitch' as const
        })
      })

      const streams = result.current.streams
      const reorderedStreams = [streams[2], streams[0], streams[1]]

      act(() => {
        result.current.reorderStreams(reorderedStreams)
      })

      const newStreams = result.current.streams
      expect(newStreams[0].channelName).toBe('channel3')
      expect(newStreams[1].channelName).toBe('channel1')
      expect(newStreams[2].channelName).toBe('channel2')
      
      // Check positions are updated
      expect(newStreams[0].position).toBe(0)
      expect(newStreams[1].position).toBe(1)
      expect(newStreams[2].position).toBe(2)
    })
  })

  describe('clear all streams', () => {
    it('clears all streams and resets state', async () => {
      const { result } = renderHook(() => useStreamStore())
      
      // Add streams first
      await act(async () => {
        await result.current.addStream({
          channelName: 'channel1',
          platform: 'twitch' as const
        })
      })

      act(() => {
        result.current.clearAllStreams()
      })

      expect(result.current.streams).toHaveLength(0)
      expect(result.current.activeStreamId).toBeNull()
      expect(result.current.primaryStreamId).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('loading and error states', () => {
    it('manages loading state correctly', () => {
      const { result } = renderHook(() => useStreamStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('manages error state correctly', () => {
      const { result } = renderHook(() => useStreamStore())

      act(() => {
        result.current.setError('Test error message')
      })

      expect(result.current.error).toBe('Test error message')

      act(() => {
        result.current.setError(null)
      })

      expect(result.current.error).toBeNull()
    })
  })
})