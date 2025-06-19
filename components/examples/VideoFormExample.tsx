// Example usage of VideoUploader component in a form

import VideoUploader from '@/components/shared/VideoUploader';
import { useState } from 'react';

export default function ExampleVideoForm() {
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedVideo) {
      alert('Please select a video');
      return;
    }

    setIsLoading(true);
    try {
      // Your form submission logic here
      console.log('Video URL:', selectedVideo);

      // Example: Submit to your API
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl: selectedVideo
          // other form data...
        })
      });

      if (response.ok) {
        alert('Video uploaded and saved successfully!');
        setSelectedVideo('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-4'>Upload Video</h2>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Select Video File
          </label>
          <VideoUploader
            setSelectedVideo={setSelectedVideo}
            isLoading={isLoading}
            maxSizeMB={200} // 200MB max
          />
        </div>

        {selectedVideo && (
          <div className='p-3 bg-green-50 border border-green-200 rounded'>
            <p className='text-sm text-green-800'>
              ✅ Video uploaded successfully!
            </p>
            <p className='text-xs text-green-600 mt-1 break-all'>
              URL: {selectedVideo}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedVideo || isLoading}
          className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Saving...' : 'Save Video'}
        </button>
      </div>
    </div>
  );
}
