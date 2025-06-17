/**
 * Utility functions for live streaming calculations
 */

export interface Video {
  id: number;
  url: string;
  duration: number;
}

export interface Channel {
  name: string;
  description: string;
  startedAt: string;
  endedAt: string;
  videos: Video[];
}

/**
 * Calculate the current video and playback position based on provided time
 * @param channel - The channel configuration
 * @param currentTime - The current time to use for calculations (can be server-synchronized time)
 */
export function calculateLivePosition(
  channel: Channel,
  currentTime?: Date
): {
  currentVideoIndex: number;
  currentVideoTime: number;
  totalElapsedTime: number;
  isLive: boolean;
} {
  const now = currentTime || new Date();
  const startTime = new Date(channel.startedAt);
  const endTime = new Date(channel.endedAt);

  // Check if we're within the broadcast window
  if (now < startTime || now > endTime) {
    return {
      currentVideoIndex: 0,
      currentVideoTime: 0,
      totalElapsedTime: 0,
      isLive: false
    };
  }

  // Calculate total duration of all videos
  const totalDuration = channel.videos.reduce(
    (sum, video) => sum + video.duration,
    0
  );

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
    isLive: true
  };
}

/**
 * Format seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Calculate progress percentage for current video
 */
export function calculateProgress(
  currentTime: number,
  duration: number
): number {
  return Math.min((currentTime / duration) * 100, 100);
}

/**
 * Get time until next video starts
 */
export function getTimeUntilNextVideo(
  currentTime: number,
  duration: number
): number {
  return Math.max(0, duration - currentTime);
}
