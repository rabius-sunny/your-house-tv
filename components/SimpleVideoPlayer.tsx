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
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle user click to start video
  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsPlaying(true);

    try {
      await video.play();
    } catch (err) {
      console.error('Failed to play video:', err);
      setError('Failed to play video');
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
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
    <div>
      {/* Video Player Container */}
      <div className='relative group bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10'>
        <div className='relative aspect-video'>
          {/* Video Element */}
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            src={src}
            controls={isPlaying}
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
                <p className='text-white/80 text-lg font-medium'>
                  Loading video...
                </p>
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && !isLoading && (
            <div
              className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer z-20'
              onClick={handlePlay}
            >
              <div className='group/play flex flex-col items-center space-y-4'>
                <div className='relative'>
                  {/* Outer ring */}
                  <div className='w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center group-hover/play:border-white/60 group-hover/play:scale-110 transition-all duration-300'>
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
                <p className='text-white/90 text-lg font-medium'>
                  Click to play
                </p>
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
      </div>
    </div>
  );
};
