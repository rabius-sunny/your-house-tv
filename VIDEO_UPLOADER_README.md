# Video Uploader with Bunny Storage

This video uploader system allows you to upload videos to Bunny Storage (Bunny CDN) similar to how your image uploader works with ImageKit.

## Features

- **Multiple video format support**: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV
- **File size validation** with customizable limits (default 100MB)
- **Progress tracking** during upload
- **Database integration** for video metadata storage
- **Error handling** with user-friendly messages
- **Automatic file cleanup** when replacing videos

## Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL=https://storage.bunnycdn.com
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=your-storage-zone-name
NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY=your-storage-access-key
NEXT_PUBLIC_BUNNY_PULL_ZONE_URL=https://your-pullzone.b-cdn.net
```

### 2. Database Migration

After adding the VideoGallery model to your Prisma schema, run:

```bash
npx prisma generate
npx prisma db push
```

### 3. Install Dependencies (if needed)

The video uploader uses your existing dependencies. No additional packages required.

## Usage

### Basic Usage

```tsx
import VideoUploader from '@/components/shared/VideoUploader';
import { useState } from 'react';

function MyComponent() {
  const [videoUrl, setVideoUrl] = useState<string>('');

  return (
    <VideoUploader
      setSelectedVideo={setVideoUrl}
      maxSizeMB={200} // Optional: default is 100MB
    />
  );
}
```

### Advanced Usage

```tsx
<VideoUploader
  setSelectedVideo={setVideoUrl}
  isLoading={isFormSubmitting}
  maxSizeMB={500} // 500MB limit
  accept='video/mp4,video/webm' // Specific formats only
/>
```

## API Endpoints

### POST /api/video-gallery

Handles video metadata storage and cleanup:

```typescript
// Request body
{
  files: [{
    fileId: string;
    url: string;
    filePath: string;
    size: number;
    fileType: string;
  }],
  deletes?: string[] // URLs to delete
}

// Response
{
  count: number // Number of videos processed
}
```

## Components

### VideoUploader

**Props:**

- `setSelectedVideo: (url: string) => void` - Callback with uploaded video URL
- `isLoading?: boolean` - Disable input during form submission
- `accept?: string` - File type filter (default: "video/\*")
- `maxSizeMB?: number` - Maximum file size in MB (default: 100)
- `multiple?: boolean` - Allow multiple files (default: false)

## Services

### BunnyStorageService

Located in `/services/bunnyStorage.ts`:

- `uploadVideo(file)` - Upload single video
- `uploadMultipleVideos(files)` - Upload multiple videos
- `deleteVideo(filePath)` - Delete single video
- `deleteMultipleVideos(filePaths)` - Delete multiple videos
- `getVideoInfo(filePath)` - Get video metadata

## Database Schema

The `VideoGallery` model stores video metadata:

```prisma
model VideoGallery {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  fileId    String   @unique
  url       String   @unique
  filePath  String
  size      Int
  fileType  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Integration Examples

### With Existing Forms

You can integrate the VideoUploader into your existing forms just like you did with ImageUploader:

```tsx
// In your Station form (example)
import VideoUploader from '@/components/shared/VideoUploader';

// Add state for video
const [videoUrl, setVideoUrl] = useState<string>('');

// In your form JSX
<div className='space-y-2'>
  <Label>Station Video</Label>
  <VideoUploader
    setSelectedVideo={setVideoUrl}
    isLoading={isLoading}
    maxSizeMB={300}
  />
</div>;
```

### For Vlog/Podcast Content

Perfect for your existing Vlog model:

```tsx
// In your Vlog creation form
<FormField
  control={form.control}
  name='video'
  render={({ field }) => (
    <FormItem>
      <FormLabel>Video Upload</FormLabel>
      <FormControl>
        <VideoUploader
          setSelectedVideo={field.onChange}
          isLoading={isLoading}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Security Notes

- File type validation on both client and server
- File size limits enforced
- Unique filename generation prevents conflicts
- Access keys should be kept secure (use environment variables)

## Troubleshooting

1. **Upload fails**: Check Bunny Storage credentials and zone configuration
2. **Large files timeout**: Increase maxSizeMB and check server timeout settings
3. **Database errors**: Ensure Prisma client is generated after schema changes

## Bunny Storage Setup

1. Create a Storage Zone in Bunny.net dashboard
2. Create a Pull Zone connected to your Storage Zone
3. Get your FTP credentials from Storage Zone settings
4. Use the Pull Zone URL as your CDN endpoint
