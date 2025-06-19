import { baseUrl } from '@/lib/utils';
import bunnyStorageService from '@/services/bunnyStorage';
import { FileBuffer } from '@/types';

export const uploadVideos = async (files: FileBuffer[], deletes?: string[]) => {
  const uploadedVideos = await bunnyStorageService.uploadMultipleVideos(files);

  if (uploadedVideos && uploadedVideos.length > 0) {
    // Store video information in the database
    const videoGalleryItems = await fetch(baseUrl + '/api/video-gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: uploadedVideos.map((item) => ({
          fileId: item.fileId,
          url: item.url,
          filePath: item.filePath,
          size: item.size,
          fileType: item.fileType
        })),
        deletes: deletes || []
      })
    });

    if (!videoGalleryItems.ok) {
      return { error: 'Failed to save video gallery items' };
    }

    return { data: uploadedVideos.map((item) => item.url) };
  }

  return { error: 'Failed to upload videos' };
};
