'use client';

import { useState, useEffect } from 'react';
import { LiveVideoPlayer } from '@/components/LiveVideoPlayer';

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
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await fetch('/api/get-videos');
        if (!response.ok) {
          throw new Error('Failed to fetch channel data');
        }
        const data = await response.json();
        setChannel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, []);

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
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='container mx-auto'>
        <LiveVideoPlayer channel={channel} />
      </div>
    </div>
  );
}
