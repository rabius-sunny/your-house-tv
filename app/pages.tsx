'use client';

import { LiveVideoPlayer } from '@/components/LiveVideoPlayer';
import { useChannelWithDurations } from '@/hooks/useChannelWithDurations';
import Link from 'next/link';

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

export default function HomePage() {
  const { channel, loading, error, durationsReady } = useChannelWithDurations();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='text-lg'>Loading Your House TV...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-2'>Error</h1>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!channel) {
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
    <div className=' bg-gray-100 py-8 px-4'>
      <div className='container mx-auto'>
        <h1 className='text-5xl my-6 font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center'>
          Your House TV
        </h1>
        <div className='flex justify-center mb-8'>
          <Link
            href='/dashboard'
            className='group inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out'
          >
            <span className='mr-2'>Dashboard</span>
            <svg
              className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </Link>
        </div>
        <LiveVideoPlayer
          channel={channel}
          durationsReady={durationsReady}
        />
      </div>
    </div>
  );
}
