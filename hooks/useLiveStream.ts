'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTimeSync } from './useTimeSync';

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

interface LiveStreamState {
  currentVideoIndex: number;
  currentVideoTime: number;
  isPlaying: boolean;
  totalElapsedTime: number;
}

export const useLiveStream = (channel: Channel) => {
  const { getServerTime, isSync } = useTimeSync();
  const [state, setState] = useState<LiveStreamState>({
    currentVideoIndex: 0,
    currentVideoTime: 0,
    isPlaying: false,
    totalElapsedTime: 0
  });

  // Calculate total duration of all videos
  const totalDuration = channel.videos.reduce(
    (sum, video) => sum + video.duration,
    0
  );

  // Calculate current position based on server-synchronized time
  const calculateCurrentPosition = useCallback(() => {
    // Use server-synchronized time instead of local client time
    const now = getServerTime();
    const startTime = new Date(channel.startedAt);
    const endTime = new Date(channel.endedAt);

    // Check if we're within the broadcast window
    if (now < startTime || now > endTime) {
      return {
        currentVideoIndex: 0,
        currentVideoTime: 0,
        totalElapsedTime: 0,
        isPlaying: false
      };
    }

    // Calculate elapsed time since start
    const elapsedMs = now.getTime() - startTime.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    // Loop the content if we've reached the end
    const loopedElapsedSeconds = elapsedSeconds % totalDuration;

    // Find which video should be playing
    let cumulativeTime = 0;
    let currentVideoIndex = 0;
    let currentVideoTime = 0;

    for (let i = 0; i < channel.videos.length; i++) {
      if (loopedElapsedSeconds < cumulativeTime + channel.videos[i].duration) {
        currentVideoIndex = i;
        currentVideoTime = loopedElapsedSeconds - cumulativeTime;
        break;
      }
      cumulativeTime += channel.videos[i].duration;
    }

    return {
      currentVideoIndex,
      currentVideoTime,
      totalElapsedTime: elapsedSeconds,
      isPlaying: true
    };
  }, [channel, totalDuration, getServerTime]);

  // Update position every second, but only after time sync is complete
  useEffect(() => {
    // Don't start the timer until time is synchronized
    if (!isSync) return;

    const updatePosition = () => {
      setState(calculateCurrentPosition());
    };

    // Initial calculation
    updatePosition();

    // Set up interval to update every second
    const interval = setInterval(updatePosition, 1000);

    return () => clearInterval(interval);
  }, [calculateCurrentPosition, isSync]);

  const getCurrentVideo = () => {
    return channel.videos[state.currentVideoIndex];
  };

  const getNextVideo = () => {
    const nextIndex = (state.currentVideoIndex + 1) % channel.videos.length;
    return channel.videos[nextIndex];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return {
    ...state,
    getCurrentVideo,
    getNextVideo,
    formatTime,
    totalDuration,
    isTimeSync: isSync
  };
};
