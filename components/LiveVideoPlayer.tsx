'use client';

import { useLiveStream } from '@/hooks/useLiveStream';
import React, { useEffect, useRef, useState } from 'react';

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
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const { currentVideoTime, isPlaying, getCurrentVideo, isTimeSync } =
    useLiveStream(channel);

  const currentVideo = getCurrentVideo();

  // Handle user interaction to enable sound (YouTube-like behavior)
  const handleVideoClick = async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasUserInteracted(true);
    setShowPlayButton(false);

    // Unmute the video on first click
    if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }

    // Try to play if not already playing
    if (video.paused && isPlaying) {
      try {
        await video.play();
      } catch (err) {
        console.error('Failed to play after user interaction:', err);
      }
    }
  };

  // Safe play function that handles autoplay policy
  const safePlay = async (video: HTMLVideoElement) => {
    try {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        await playPromise;
      }
      setShowPlayButton(false);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        console.log('Autoplay prevented - showing play button');
        setShowPlayButton(true);
      } else {
        console.error('Failed to play video:', error);
        setError('Failed to play video');
      }
    }
  };

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
        await safePlay(video);
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

    const handlePlayback = async () => {
      if (isPlaying && video.paused && !isLoading) {
        await safePlay(video);
      } else if (!isPlaying && !video.paused) {
        video.pause();
      }
    };

    handlePlayback();
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
      <div className=' video-box bg-black rounded-lg overflow-hidden shadow-2xl aspect-video flex items-center justify-center'>
        <div className='flex items-center justify-center bg-black bg-opacity-75 text-white z-10'>
          <div className='flex items-center space-x-2'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  if (!durationsReady) {
    return (
      <div className='video-box'>
        <div className='bg-black rounded-lg overflow-hidden shadow-2xl aspect-video flex items-center justify-center'>
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

  if (!isPlaying) {
    return (
      <div className='video-box'>
        <div className=' bg-black rounded-lg overflow-hidden aspect-video'>
          <div className=' flex items-center justify-center bg-gray-900 text-white'>
            <div className='text-center'>
              <p className='text-gray-300'>
                Broadcast will start at{' '}
                {new Date(channel.startedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8 xl:px-12'>
      <div className=' w-full mx-auto  max-w-7xl  bg-black rounded-lg overflow-hidden shadow-2xl'>
        <div className='relative aspect-video'>
          <video
            ref={videoRef}
            className='w-full h-full object-cover cursor-pointer'
            muted={isMuted}
            autoPlay
            playsInline
            preload='metadata'
            onClick={handleVideoClick}
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
            <>
              <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1'>
                <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                <span>LIVE</span>
              </div>

              {/* YouTube-like Play Button Overlay - Only shows when autoplay fails */}
              {showPlayButton && (
                <div
                  className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer z-30'
                  onClick={handleVideoClick}
                >
                  <div className='bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 hover:scale-110'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      className='w-12 h-12 text-black'
                    >
                      <path d='M8 5v14l11-7z' />
                    </svg>
                  </div>
                </div>
              )}

              {/* Sound indicator when muted */}
              {isMuted && !showPlayButton && (
                <div className='absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm flex items-center space-x-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={2}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z'
                    />
                  </svg>
                  <span>Click on the video to unmute</span>
                </div>
              )}

              {/* Mute/Unmute Button - Only show after user interaction */}
              {hasUserInteracted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                    }
                  }}
                  className='absolute top-4 right-4 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 hover:scale-110'
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z'
                      />
                    </svg>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
