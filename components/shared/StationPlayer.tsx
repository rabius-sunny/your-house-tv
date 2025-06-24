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
      <div className='video-box'>
        <div className='my-10 bg-black  rounded-lg overflow-hidden shadow-2xl aspect-video flex items-center justify-center'>
          <div className='flex items-center justify-center bg-black bg-opacity-75 text-white z-10'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!loading && !channel) {
    return (
      <div className='video-box'>
        <div className='my-10  bg-black rounded-lg overflow-hidden shadow-2xl aspect-video flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-white'>
              No channel data available
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=' my-10'>
      <LiveVideoPlayer
        channel={channel!}
        durationsReady={durationsReady}
      />
    </div>
  );
}
