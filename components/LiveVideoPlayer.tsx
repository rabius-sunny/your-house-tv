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
}

export const LiveVideoPlayer: React.FC<LiveVideoPlayerProps> = ({
  channel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');

  const {
    currentVideoIndex,
    currentVideoTime,
    isPlaying,
    totalElapsedTime,
    getCurrentVideo,
    getNextVideo,
    formatTime,
    totalDuration
  } = useLiveStream(channel);

  const currentVideo = getCurrentVideo();

  // Debug effect to log current state
  useEffect(() => {
    if (currentVideo) {
      console.log('Video Player State:', {
        currentVideoIndex,
        currentVideoTime,
        isPlaying,
        videoUrl: currentVideo.url,
        videoDuration: currentVideo.duration,
        isLoading,
        error
      });
    }
  }, [
    currentVideoIndex,
    currentVideoTime,
    isPlaying,
    currentVideo,
    isLoading,
    error
  ]);

  // Handle video loading and time synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;

    const handleLoadedData = async () => {
      setIsLoading(false);
      setError(null);

      // Sync video time with calculated position
      video.currentTime = currentVideoTime;

      // Start playing if should be playing
      if (isPlaying) {
        try {
          await video.play();
        } catch (err) {
          console.error('Failed to play video:', err);
          setError('Failed to play video');
        }
      }
    };

    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [currentVideo, currentVideoTime, isPlaying]);

  // Handle play/pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && video.paused && !isLoading) {
      video.play().catch((err) => {
        console.error('Failed to play video:', err);
        setError('Failed to play video');
      });
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, isLoading]);

  // Handle video source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;

    // Only change source if it's actually different
    if (currentVideoUrl !== currentVideo.url) {
      setIsLoading(true);
      setError(null);
      setCurrentVideoUrl(currentVideo.url);
      video.src = currentVideo.url;
      video.load();
    }
  }, [currentVideo, currentVideoUrl]);

  // Periodic time sync to keep videos in sync (less aggressive)
  useEffect(() => {
    if (!isPlaying) return;

    const syncInterval = setInterval(() => {
      const video = videoRef.current;
      if (!video || isLoading) return;

      const timeDiff = Math.abs(video.currentTime - currentVideoTime);
      // Only sync if drift is significant (more than 5 seconds)
      if (timeDiff > 5) {
        video.currentTime = currentVideoTime;
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(syncInterval);
  }, [isPlaying, currentVideoTime, isLoading]);

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
      {/* Video Player */}
      <div className='relative aspect-video'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              <span>Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className='absolute inset-0 flex items-center justify-center bg-red-900 text-white z-10'>
            <div className='text-center'>
              <p className='text-2xl font-semibold'>Error</p>
              <p className='text-3xl'>{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className='w-full h-full object-cover'
          muted
          autoPlay
          playsInline
          preload='metadata'
        />

        {/* Live indicator */}
        <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1'>
          <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
          <span>LIVE</span>
        </div>
      </div>

      {/* Video Info */}
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

        {/* Progress Bar */}
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

        {/* Next Video Preview */}
        <div className='mt-3 text-xs text-gray-400'>
          Up next: Video {getNextVideo().id}
        </div>
      </div>
    </div>
  );
};
