'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  thumbnail?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  thumbnail
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  // Handle initial play attempt with autoplay policy
  const handleInitialPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Try to play muted first (allowed by autoplay policy)
      video.muted = true;
      await video.play();
      setShowPlayButton(false);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        // Show play button if autoplay is blocked
        setShowPlayButton(true);
      } else {
        console.error('Failed to play video:', error);
        setError('Failed to load video');
      }
    }
  };

  // Handle user click to start video
  const handleUserPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasUserInteracted(true);
    setShowPlayButton(false);

    try {
      // Unmute and play after user interaction
      video.muted = false;
      await video.play();
    } catch (err) {
      console.error('Failed to play video:', err);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
      // Try to autoplay once metadata is loaded
      handleInitialPlay();
    };
    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  if (error) {
    return (
      <div className='w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl'>
        <div className='aspect-video flex items-center justify-center bg-red-900 text-white'>
          <div className='text-center'>
            <p className='text-xl font-semibold'>Error</p>
            <p className='text-sm'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-5xl mx-auto'>
      {/* Video Title */}
      <div className='mb-6'>
        <h1 className='text-3xl md:text-4xl font-bold text-white mb-2 leading-tight'>
          {title}
        </h1>
        <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
      </div>

      {/* Video Player Container */}
      <div className='relative group bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10'>
        <div className='relative aspect-video'>
          {/* Video Element */}
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            src={src}
            controls={hasUserInteracted}
            preload='metadata'
            poster={thumbnail}
            playsInline
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='relative'>
                  <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-8 h-8 bg-white/20 rounded-full'></div>
                  </div>
                </div>
                <p className='text-white/80 text-lg font-medium'>Loading video...</p>
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          {showPlayButton && !isLoading && (
            <div 
              className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer z-20'
              onClick={handleUserPlay}
            >
              <div className='group/play flex flex-col items-center space-y-4'>
                <div className='relative'>
                  {/* Outer ring */}
                  <div className='w-24 h-24 border-2 border-white/40 rounded-full flex items-center justify-center group-hover/play:border-white/60 group-hover/play:scale-110 transition-all duration-300'>
                    {/* Inner play button */}
                    <div className='w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        className='w-8 h-8 text-black ml-1'
                      >
                        <path d='M8 5v14l11-7z' />
                      </svg>
                    </div>
                  </div>
                  {/* Pulse animation */}
                  <div className='absolute inset-0 w-24 h-24 border-2 border-white/20 rounded-full animate-ping'></div>
                </div>
                <p className='text-white/90 text-lg font-medium'>Click to play</p>
              </div>
            </div>
          )}

          {/* Gradient overlays for better aesthetics */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none'></div>
          
          {/* Corner decorations */}
          <div className='absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/30 rounded-tl-lg'></div>
          <div className='absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/30 rounded-tr-lg'></div>
          <div className='absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/30 rounded-bl-lg'></div>
          <div className='absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-lg'></div>
        </div>

        {/* Video Info Bar (only shows when not interacted) */}
        {!hasUserInteracted && !showPlayButton && !isLoading && (
          <div className='absolute bottom-6 left-6 right-6'>
            <div className='bg-black/70 backdrop-blur-md rounded-lg px-4 py-3 border border-white/10'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                  <span className='text-white/90 text-sm font-medium'>Click to play with sound</span>
                </div>
                <div className='flex items-center space-x-2 text-white/60'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z'
                    />
                  </svg>
                  <span className='text-xs'>Sound ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced styling with glow effect */}
      <style jsx>{`
        .group:hover .w-24.h-24.border-white\\/40 {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Safe play function
  const safePlay = async (video: HTMLVideoElement) => {
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        console.log('Autoplay prevented - showing play button');
        setShowPlayButton(true);
      } else {
        console.error('Failed to play video:', error);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setHasUserInteracted(true);

    if (video.paused) {
      await safePlay(video);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    video.muted = newMutedState;
  };

  // Change volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;

    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  // Seek to time
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Show/hide controls
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      className='relative bg-black rounded-lg overflow-hidden shadow-2xl group'
      onMouseEnter={showControlsTemporarily}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className='relative aspect-video'>
        <video
          ref={videoRef}
          className='w-full h-full object-cover cursor-pointer'
          src={src}
          poster={thumbnail}
          muted={isMuted}
          playsInline
          preload='metadata'
          onClick={handleVideoClick}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-20'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
              <span>Loading...</span>
            </div>
          </div>
        )}

        {/* Play Button Overlay - Shows when autoplay fails */}
        {showPlayButton && (
          <div 
            className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer z-30'
            onClick={handleVideoClick}
          >
            <div className='bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transition-all duration-200 hover:scale-110'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                className='w-16 h-16 text-black'
              >
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          </div>
        )}

        {/* Sound indicator when muted */}
        {isMuted && !showPlayButton && !hasUserInteracted && (
          <div className='absolute bottom-20 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm flex items-center space-x-2'>
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
            <span>Click to unmute</span>
          </div>
        )}

        {/* Video Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Progress Bar */}
          <div className='mb-4'>
            <input
              type='range'
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className='w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider'
              style={{
                background: `linear-gradient(to right, #ffffff ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%)`
              }}
            />
            <div className='flex justify-between text-xs text-white mt-1'>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Play/Pause Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={togglePlayPause}
                className='text-white hover:bg-white/20 p-2 h-auto'
              >
                {isPlaying ? (
                  <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                  </svg>
                ) : (
                  <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                )}
              </Button>

              {/* Volume Controls */}
              <div className='flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={toggleMute}
                  className='text-white hover:bg-white/20 p-2 h-auto'
                >
                  {isMuted || volume === 0 ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z' />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z' />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.51c0-.97.71-1.76 1.59-1.76h6.75z' />
                    </svg>
                  )}
                </Button>
                <div className='w-20'>
                  <input
                    type='range'
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    className='w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer'
                    style={{
                      background: `linear-gradient(to right, #ffffff ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right side controls */}
            <div className='flex items-center space-x-2'>
              {/* Fullscreen Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleFullscreen}
                className='text-white hover:bg-white/20 p-2 h-auto'
              >
                {isFullscreen ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5m0 0l5.5 5.5' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15' />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
