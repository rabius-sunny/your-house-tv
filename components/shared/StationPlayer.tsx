'use client';

import { LiveVideoPlayer } from '@/components/LiveVideoPlayer';
import { useChannelWithDurations } from '@/hooks/useChannelWithDurations';
import { Station } from '@/types';

type TProps = {
  station: Station;
  loading: boolean;
};

export default function StationPlayer({ station, loading }: TProps) {
  const { channel, durationsReady } = useChannelWithDurations(station);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-600'>Loading...</h1>
        </div>
      </div>
    );
  }
  if (!loading && !channel) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-600'>
            No channel data available
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className='box my-10'>
      <LiveVideoPlayer
        channel={channel!}
        durationsReady={durationsReady}
      />
    </div>
  );
}
