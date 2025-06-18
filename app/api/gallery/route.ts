import db from '@/config/db';
import imageKitService from '@/services/imageKit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.deletes && body.deletes.length > 0) {
      const filesToDelete = await db.gallery.findMany({
        where: {
          url: {
            in: body.deletes
          }
        }
      });
      if (filesToDelete.length) {
        const deleted = await imageKitService.deleteMultipleFiles(
          filesToDelete.map((file) => file.fileId)
        );
        await db.gallery.deleteMany({
          where: {
            url: {
              in: body.deletes
            }
          }
        });
      }
    }
    const galleryItems = await db.gallery.createMany({
      data: body.files.map((file: any) => ({
        fileId: file.fileId,
        url: file.url
      }))
    });
    return NextResponse.json(galleryItems.count, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
