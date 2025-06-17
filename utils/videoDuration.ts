/**
 * Utility functions for fetching video duration from URLs
 */

interface VideoWithDuration {
  id: number;
  url: string;
  duration: number;
}

/**
 * Get video duration from a video URL using HTML5 video element
 * @param url - The video URL
 * @returns Promise<number> - Duration in seconds
 */
export async function getVideoDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      resolve(Math.floor(video.duration) || 0);
    };

    video.onerror = (error) => {
      console.warn(`Failed to load video metadata for ${url}:`, error);
      resolve(40); // Fallback duration
    };

    video.onabort = () => {
      console.warn(`Video loading aborted for ${url}`);
      resolve(40); // Fallback duration
    };

    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn(`Timeout loading video metadata for ${url}`);
      resolve(40); // Fallback duration
    }, 10000); // 10 second timeout

    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
    });

    // Set properties to load metadata only
    video.preload = 'metadata';
    video.src = url;
    video.load();
  });
}

/**
 * Batch fetch durations for multiple videos with their IDs
 * @param videos - Array of video objects with id and url
 * @returns Promise<VideoWithDuration[]> - Array of videos with durations
 */
export async function fetchVideoDurations(
  videos: { id: number; url: string }[]
): Promise<VideoWithDuration[]> {
  const videoPromises = videos.map(async (video) => {
    try {
      const duration = await getVideoDuration(video.url);
      return {
        ...video,
        duration
      };
    } catch (error) {
      console.warn(`Failed to get duration for video ${video.id}:`, error);
      return {
        ...video,
        duration: 40 // Fallback duration
      };
    }
  });

  return Promise.all(videoPromises);
}
