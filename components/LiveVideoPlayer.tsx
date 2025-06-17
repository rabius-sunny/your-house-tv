'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLiveStream } from '@/hooks/useLiveStream';

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

interface LiveVideoPlayerProps {
  channel: Channel;
  durationsReady?: boolean;
}

export const LiveVideoPlayer: React.FC<LiveVideoPlayerProps> = ({
  channel,
  durationsReady = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  const {
    currentVideoIndex,
    currentVideoTime,
    isPlaying,
    totalElapsedTime,
    getCurrentVideo,
    getNextVideo,
    formatTime,
    totalDuration,
    isTimeSync
  } = useLiveStream(channel);

  const currentVideo = getCurrentVideo();

  useEffect(() => {
    if (
      currentVideo &&
      isTimeSync &&
      (!initialized || currentVideoUrl !== currentVideo.url)
    ) {
      setCurrentVideoUrl(currentVideo.url);
      setInitialized(true);
      setError(null);
    }
  }, [currentVideo, isTimeSync, initialized, currentVideoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo || !isTimeSync) return;

    const handleLoadedData = async () => {
      setIsLoading(false);
      setError(null);

      video.currentTime = currentVideoTime;

      if (isPlaying) {
        try {
          await video.play();
        } catch (err) {
          console.error('Failed to play video:', err);
          setError('Failed to play video');
        }
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentVideo, currentVideoTime, isPlaying, isTimeSync]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isTimeSync) return;

    if (isPlaying && video.paused && !isLoading) {
      video.play().catch((err) => {
        console.error('Failed to play video:', err);
        setError('Failed to play video');
      });
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, isLoading, isTimeSync]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo || !isTimeSync) return;

    if (currentVideoUrl !== currentVideo.url || !video.src) {
      setIsLoading(true);
      setError(null);
      setCurrentVideoUrl(currentVideo.url);
      video.src = currentVideo.url;
      video.load();

      const loadTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      return () => {
        clearTimeout(loadTimeout);
      };
    }
  }, [currentVideo, currentVideoUrl, isTimeSync, initialized]);

  useEffect(() => {
    if (!isPlaying || !isTimeSync) return;

    const syncInterval = setInterval(() => {
      const video = videoRef.current;
      if (!video || isLoading) return;

      const timeDiff = Math.abs(video.currentTime - currentVideoTime);
      if (timeDiff > 5) {
        video.currentTime = currentVideoTime;
      }
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [isPlaying, currentVideoTime, isLoading, isTimeSync]);

  if (!isTimeSync) {
    return (
      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-10'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  if (!durationsReady) {
    return (
      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-10'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className='w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden'>
        <div className='aspect-video flex items-center justify-center bg-gray-900 text-white'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-2'>{channel.name}</h2>
            <p className='text-gray-300'>
              Broadcast will start at{' '}
              {new Date(channel.startedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl'>
      <div className='relative aspect-video'>
        <video
          ref={videoRef}
          className='w-full h-full object-cover'
          muted
          autoPlay
          playsInline
          preload='metadata'
        />

        {isLoading && !error && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-10'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              <span>Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className='absolute inset-0 flex items-center justify-center bg-red-900 text-white z-20'>
            <div className='text-center'>
              <p className='text-xl font-semibold'>Error</p>
              <p className='text-sm'>{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1'>
            <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
            <span>LIVE</span>
          </div>
        )}
      </div>

      <div className='p-4 bg-gray-900 text-white'>
        <div className='flex justify-between items-start mb-2'>
          <div>
            <h2 className='text-xl font-bold'>{channel.name}</h2>
            <p className='text-gray-300 text-sm'>{channel.description}</p>
          </div>
          <div className='text-right text-sm'>
            <p className='text-gray-400'>
              Now Playing: Video {currentVideo.id}
            </p>
          </div>
        </div>

        <div className='mt-4'>
          <div className='flex justify-between text-xs text-gray-400 mb-1'>
            <span>{formatTime(currentVideoTime)}</span>
            <span>
              Video {currentVideoIndex + 1} of {channel.videos.length}
            </span>
            <span>{formatTime(currentVideo.duration)}</span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-1'>
            <div
              className='bg-red-600 h-1 rounded-full transition-all duration-1000'
              style={{
                width: `${(currentVideoTime / currentVideo.duration) * 100}%`
              }}
            ></div>
          </div>
        </div>

        <div className='mt-3 text-xs text-gray-400'>
          Up next: Video {getNextVideo().id}
        </div>
      </div>
    </div>
  );
};
