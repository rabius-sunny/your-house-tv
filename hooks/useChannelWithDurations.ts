'use client';

import { Station } from '@/types';
import { fetchVideoDurations } from '@/utils/videoDuration';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Video {
  id: number;
  url: string;
  duration: number;
}

interface Channel {
  startedAt: Date;
  endedAt: Date;
  videos: Video[];
}

interface UseChannelWithDurationsResult {
  channel: Channel | null;
  durationsReady: boolean;
}

/**
 * Hook to fetch channel data with actual video durations
 */
export const useChannelWithDurations = (
  station: Station
): UseChannelWithDurationsResult => {
  const [durationsReady, setDurationsReady] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    console.log('data', { station, channel, durationsReady });
    const fetchChannelData = async () => {
      try {
        setDurationsReady(false);

        const videosWithActualDurations = await fetchVideoDurations(
          station.videos.map((video, idx) => ({
            id: idx,
            url: video
          }))
        );

        // Update channel with actual durations
        const updatedChannel = {
          ...station,
          videos: videosWithActualDurations
        };

        console.log('log', { videosWithActualDurations, updatedChannel });

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
        setDurationsReady(false);
        toast.error('Failed to fetch video durations. Please try again later.');
      }
    };

    fetchChannelData();
  }, [station]);

  return {
    channel,
    durationsReady
  };
};
