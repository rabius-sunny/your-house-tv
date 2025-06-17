'use client';

import { useState, useEffect } from 'react';
import { fetchVideoDurations } from '@/utils/videoDuration';

interface Video {
  id: number;
  url: string;
  duration: number;
}

interface Channel {
  name: string;
  description: string;
  startedAt: string;
  endedAt: string;
  videos: Video[];
}

interface UseChannelWithDurationsResult {
  channel: Channel | null;
  loading: boolean;
  error: string | null;
  durationsReady: boolean;
}

/**
 * Hook to fetch channel data with actual video durations
 */
export const useChannelWithDurations = (): UseChannelWithDurationsResult => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [durationsReady, setDurationsReady] = useState(false);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch the initial channel data from API
        const response = await fetch('/api/get-videos');
        if (!response.ok) {
          throw new Error('Failed to fetch channel data');
        }

        const initialChannel: Channel = await response.json();
        setChannel(initialChannel);
        setLoading(false);

        // Then, fetch actual video durations in the background
        console.log('Fetching actual video durations...');
        setDurationsReady(false);

        const videosWithActualDurations = await fetchVideoDurations(
          initialChannel.videos.map((video) => ({
            id: video.id,
            url: video.url
          }))
        );

        // Update channel with actual durations
        const updatedChannel = {
          ...initialChannel,
          videos: videosWithActualDurations
        };

        console.log(
          'Video durations fetched:',
          videosWithActualDurations.map((v) => ({
            id: v.id,
            duration: v.duration
          }))
        );
        setChannel(updatedChannel);
        setDurationsReady(true);
      } catch (err) {
        console.error('Error fetching channel data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchChannelData();
  }, []);

  return {
    channel,
    loading,
    error,
    durationsReady
  };
};
