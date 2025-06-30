import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, AnalyticsData, WatchPartySession } from '../types';

interface AppStore {
  preferences: UserPreferences;
  analytics: AnalyticsData;
  watchParty: WatchPartySession | null;
  isPremium: boolean;
  isRecording: boolean;
  
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateAnalytics: (data: Partial<AnalyticsData>) => void;
  
  startWatchParty: (streams: string[]) => void;
  joinWatchParty: (sessionId: string) => void;
  leaveWatchParty: () => void;
  addReaction: (emoji: string) => void;
  
  setPremium: (isPremium: boolean) => void;
  toggleRecording: () => void;
  
  resetApp: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  defaultQuality: 'auto',
  autoplay: true,
  lowLatencyMode: false,
  chatEnabled: true,
  notificationsEnabled: true,
  gridLayout: 'auto',
};

const defaultAnalytics: AnalyticsData = {
  totalWatchTime: 0,
  favoriteStreams: [],
  watchHistory: [],
  peakViewers: 0,
  averageSessionDuration: 0,
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      analytics: defaultAnalytics,
      watchParty: null,
      isPremium: false,
      isRecording: false,
      
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      
      updateAnalytics: (data) =>
        set((state) => ({
          analytics: { ...state.analytics, ...data },
        })),
      
      startWatchParty: (streams) =>
        set({
          watchParty: {
            id: `wp-${Date.now()}`,
            hostId: 'current-user',
            participants: ['current-user'],
            streams,
            reactions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        }),
      
      joinWatchParty: (sessionId) =>
        set((state) => {
          if (!state.watchParty) return state;
          return {
            watchParty: {
              ...state.watchParty,
              participants: [...state.watchParty.participants, 'current-user'],
            },
          };
        }),
      
      leaveWatchParty: () => set({ watchParty: null }),
      
      addReaction: (emoji) =>
        set((state) => {
          if (!state.watchParty) return state;
          return {
            watchParty: {
              ...state.watchParty,
              reactions: [
                ...state.watchParty.reactions,
                {
                  userId: 'current-user',
                  emoji,
                  timestamp: Date.now(),
                },
              ],
            },
          };
        }),
      
      setPremium: (isPremium) => set({ isPremium }),
      
      toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
      
      resetApp: () =>
        set({
          preferences: defaultPreferences,
          analytics: defaultAnalytics,
          watchParty: null,
          isPremium: false,
          isRecording: false,
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;