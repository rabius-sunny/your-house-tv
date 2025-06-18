import { baseUrl } from '@/lib/utils';
import imageKitService from '@/services/imageKit';
import { FileBuffer } from '@/types';

export const uploadFiles = async (files: FileBuffer[], deletes?: string[]) => {
  const uploadedFiles = await imageKitService.uploadMultipleFiles(files);

  if (uploadedFiles && uploadedFiles.length > 0) {
    // Store file information in the database
    const galleryItems = await fetch(baseUrl + '/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: uploadedFiles.map((item) => ({
          fileId: item.fileId,
          url: item.url
        })),
        deletes: deletes || []
      })
    });
    if (!galleryItems.ok) {
      return { error: 'Failed to save gallery items' };
    }

    return { data: uploadedFiles.map((item) => item.url) };
  }
  return { error: 'Failed to save gallery items' };
};
