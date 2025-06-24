'use client';

import { Station } from '@/types';
import { fetchVideoDurations } from '@/utils/videoDuration';
import { useEffect, useState } from 'react';

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

        setChannel(updatedChannel);
        setDurationsReady(true);
      } catch (err) {
        setDurationsReady(false);
        console.log('err on getting duration');
      }
    };

    fetchChannelData();
  }, [station]);

  return {
    channel,
    durationsReady
  };
};
