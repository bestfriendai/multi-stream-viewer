import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stream, StreamState } from '../types';

interface StreamStore {
  streams: Stream[];
  streamStates: Record<string, StreamState>;
  activeStreamId: string | null;
  gridLayout: '1x1' | '2x2' | '3x3' | 'custom';
  customLayout: { rows: number; cols: number };
  
  addStream: (stream: Stream) => void;
  removeStream: (streamId: string) => void;
  updateStream: (streamId: string, updates: Partial<Stream>) => void;
  setActiveStream: (streamId: string | null) => void;
  
  updateStreamState: (streamId: string, state: Partial<StreamState>) => void;
  setVolume: (streamId: string, volume: number) => void;
  toggleMute: (streamId: string) => void;
  setQuality: (streamId: string, quality: StreamState['quality']) => void;
  
  setGridLayout: (layout: '1x1' | '2x2' | '3x3' | 'custom') => void;
  setCustomLayout: (rows: number, cols: number) => void;
  reorderStreams: (fromIndex: number, toIndex: number) => void;
  
  clearAllStreams: () => void;
}

const useStreamStore = create<StreamStore>()(
  persist(
    (set) => ({
      streams: [],
      streamStates: {},
      activeStreamId: null,
      gridLayout: '2x2',
      customLayout: { rows: 2, cols: 2 },
      
      addStream: (stream) =>
        set((state) => {
          const newState: StreamState = {
            id: stream.id,
            volume: 100,
            isMuted: false,
            quality: 'auto',
            isFullscreen: false,
            position: state.streams.length,
            isPinned: false,
          };
          
          return {
            streams: [...state.streams, stream],
            streamStates: {
              ...state.streamStates,
              [stream.id]: newState,
            },
          };
        }),
      
      removeStream: (streamId) =>
        set((state) => {
          const { [streamId]: removed, ...remainingStates } = state.streamStates;
          return {
            streams: state.streams.filter((s) => s.id !== streamId),
            streamStates: remainingStates,
            activeStreamId: state.activeStreamId === streamId ? null : state.activeStreamId,
          };
        }),
      
      updateStream: (streamId, updates) =>
        set((state) => ({
          streams: state.streams.map((s) =>
            s.id === streamId ? { ...s, ...updates } : s
          ),
        })),
      
      setActiveStream: (streamId) => set({ activeStreamId: streamId }),
      
      updateStreamState: (streamId, stateUpdate) =>
        set((state) => ({
          streamStates: {
            ...state.streamStates,
            [streamId]: {
              ...state.streamStates[streamId],
              ...stateUpdate,
            },
          },
        })),
      
      setVolume: (streamId, volume) =>
        set((state) => ({
          streamStates: {
            ...state.streamStates,
            [streamId]: {
              ...state.streamStates[streamId],
              volume,
            },
          },
        })),
      
      toggleMute: (streamId) =>
        set((state) => {
          const currentStreamState = state.streamStates[streamId];
          if (!currentStreamState) return state;
          
          const wasStreamMuted = currentStreamState.isMuted;
          const newStreamStates = { ...state.streamStates };
          
          // If we're unmuting this stream, mute all other streams first
          if (wasStreamMuted) {
            Object.keys(newStreamStates).forEach(id => {
              if (id !== streamId) {
                newStreamStates[id] = {
                  ...newStreamStates[id],
                  isMuted: true,
                };
              }
            });
          }
          
          // Toggle the target stream
          newStreamStates[streamId] = {
            ...currentStreamState,
            isMuted: !currentStreamState.isMuted,
          };
          
          return { streamStates: newStreamStates };
        }),
      
      setQuality: (streamId, quality) =>
        set((state) => ({
          streamStates: {
            ...state.streamStates,
            [streamId]: {
              ...state.streamStates[streamId],
              quality,
            },
          },
        })),
      
      setGridLayout: (layout) => set({ gridLayout: layout }),
      
      setCustomLayout: (rows, cols) =>
        set({ customLayout: { rows, cols }, gridLayout: 'custom' }),
      
      reorderStreams: (fromIndex, toIndex) =>
        set((state) => {
          const newStreams = [...state.streams];
          const [removed] = newStreams.splice(fromIndex, 1);
          newStreams.splice(toIndex, 0, removed);
          
          const newStates = { ...state.streamStates };
          newStreams.forEach((stream, index) => {
            if (newStates[stream.id]) {
              newStates[stream.id] = {
                ...newStates[stream.id],
                position: index,
              };
            }
          });
          
          return { streams: newStreams, streamStates: newStates };
        }),
      
      clearAllStreams: () =>
        set({
          streams: [],
          streamStates: {},
          activeStreamId: null,
        }),
    }),
    {
      name: 'stream-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStreamStore;