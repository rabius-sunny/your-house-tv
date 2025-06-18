import db from '@/config/db';
import imageKitService from '@/services/imageKit';
import { FileBuffer } from '@/types';

export const uploadFiles = async (files: FileBuffer[]) => {
  const uploadedFiles = await imageKitService.uploadMultipleFiles(files);

  if (uploadedFiles && uploadedFiles.length > 0) {
    // Store file information in the database
    const galleryItems = await db.gallery.createMany({
      data: uploadedFiles.map((file) => ({
        fileId: file.fileId,
        url: file.url
      }))
    });

    return galleryItems.count;
  }
};
