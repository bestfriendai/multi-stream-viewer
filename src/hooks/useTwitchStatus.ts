import { useEffect, useState, useRef } from 'react';
import { twitchService, StreamStatusMap } from '@/services/twitchService';

interface UseTwitchStatusOptions {
  refreshInterval?: number; // in milliseconds, default 60000 (1 minute)
  enabled?: boolean; // whether to fetch status
}

export function useTwitchStatus(
  channels: string[],
  options: UseTwitchStatusOptions = {}
) {
  const { refreshInterval = 60000, enabled = true } = options;
  
  const [status, setStatus] = useState<StreamStatusMap>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || channels.length === 0) {
      setStatus(new Map());
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await twitchService.getStreamStatus(channels);
        
        if (mountedRef.current) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          console.error('Failed to fetch Twitch status:', err);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchStatus();

    // Set up refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchStatus, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [channels, refreshInterval, enabled]);

  return { status, loading, error };
}

// Hook for a single channel
export function useSingleChannelStatus(
  channel: string,
  options: UseTwitchStatusOptions = {}
) {
  const { status, loading, error } = useTwitchStatus(
    channel ? [channel] : [],
    options
  );

  const channelStatus = channel ? status.get(channel) : undefined;

  return {
    status: channelStatus,
    isLive: channelStatus?.isLive || false,
    loading,
    error
  };
}