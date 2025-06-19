import db from '@/config/db';
import bunnyStorageService from '@/services/bunnyStorage';
import { NextRequest, NextResponse } from 'next/server';

interface VideoFile {
  fileId: string;
  url: string;
  filePath: string;
  size: number;
  fileType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle video deletions
    if (body.deletes && body.deletes.length > 0) {
      const videosToDelete = await db.videoGallery.findMany({
        where: {
          url: {
            in: body.deletes
          }
        }
      });

      if (videosToDelete.length) {
        // Delete from Bunny Storage
        await bunnyStorageService.deleteMultipleVideos(
          videosToDelete.map((video) => video.filePath)
        );

        // Delete from database
        await db.videoGallery.deleteMany({
          where: {
            url: {
              in: body.deletes
            }
          }
        });
      }
    }

    // Create new video gallery items
    if (body.files && body.files.length > 0) {
      const videoGalleryItems = await db.videoGallery.createMany({
        data: body.files.map((file: VideoFile) => ({
          fileId: file.fileId,
          url: file.url,
          filePath: file.filePath,
          size: file.size,
          fileType: file.fileType
        }))
      });

      return NextResponse.json(videoGalleryItems.count, { status: 201 });
    }

    return NextResponse.json(
      { message: 'No files to process' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing video request:', error);
    return NextResponse.json(
      { error: 'Failed to process video request' },
      { status: 500 }
    );
  }
}
