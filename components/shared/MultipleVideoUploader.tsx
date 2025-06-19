'use client';

import { uploadVideos } from '@/helper/videoUploader';
import { FileBuffer } from '@/types';
import { Trash2, Upload, Video } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

type TProps = {
  uploadedVideos: string[];
  onVideoAdd: (videoUrl: string) => void;
  onVideoRemove: (index: number) => void;
  isLoading?: boolean;
  accept?: string;
  maxSizeMB?: number;
  setIsUploading?: (loading: boolean) => void;
};

export default function MultipleVideoUploader({
  uploadedVideos,
  onVideoAdd,
  onVideoRemove,
  isLoading,
  accept = 'video/*',
  maxSizeMB = 1024,
  setIsUploading
}: TProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCurrentlyUploading, setIsCurrentlyUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/mkv'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type', {
          description:
            'Please select a valid video file (MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV)'
        });
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error('File too large', {
          description: `Please select a file smaller than ${maxSizeMB}MB`
        });
        return;
      }

      setCurrentFile(selectedFile);
      setIsCurrentlyUploading(true);
      setIsUploading?.(true);
      setUploadProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 10;
          });
        }, 500);

        const uploadResult = await uploadVideos(
          [await convertFileToBuffer(selectedFile)],
          ['']
        );

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadResult?.error || !uploadResult.data) {
          toast.error(uploadResult.error || 'Upload failed');
          return;
        }

        if (uploadResult.data?.length > 0) {
          onVideoAdd(uploadResult.data[0]);
          toast.success('Video uploaded successfully!');
        } else {
          throw new Error('Failed to upload video');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload video');
      } finally {
        setIsCurrentlyUploading(false);
        setIsUploading?.(false);
        setUploadProgress(0);
        setCurrentFile(null);
        // Reset the input
        event.target.value = '';
      }
    }
  };

  const convertFileToBuffer = async (file: File): Promise<FileBuffer> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);

        resolve({
          fieldname: 'video',
          originalname: file.name,
          encoding: '7bit',
          mimetype: file.type,
          buffer: buffer,
          size: file.size
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoFileName = (url: string): string => {
    try {
      const urlParts = url.split('/');
      return (
        urlParts[urlParts.length - 1] ||
        `Video ${uploadedVideos.indexOf(url) + 1}`
      );
    } catch {
      return `Video ${uploadedVideos.indexOf(url) + 1}`;
    }
  };

  return (
    <div className='space-y-4'>
      {/* Upload Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Upload className='h-4 w-4' />
          <Label>Upload Video</Label>
        </div>

        <Input
          type='file'
          accept={accept}
          onChange={handleFileChange}
          disabled={isLoading || isCurrentlyUploading}
        />

        {isCurrentlyUploading && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress
              value={uploadProgress}
              className='h-2'
            />
          </div>
        )}

        {currentFile && !isCurrentlyUploading && (
          <div className='p-3 bg-muted rounded-lg'>
            <p className='text-sm font-medium text-foreground'>
              Selected: {currentFile.name}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Size: {formatFileSize(currentFile.size)} | Type:{' '}
              {currentFile.type}
            </p>
          </div>
        )}

        <div className='text-xs text-muted-foreground'>
          <p>Supported formats: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV</p>
          <p>Maximum file size: {maxSizeMB}MB</p>
        </div>
      </div>

      {/* Uploaded Videos List */}
      {uploadedVideos.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Video className='h-4 w-4' />
            <Label className='text-sm text-muted-foreground'>
              Uploaded Videos ({uploadedVideos.length})
            </Label>
          </div>

          <div className='space-y-2'>
            {uploadedVideos.map((videoUrl, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-muted rounded-lg'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>
                    {getVideoFileName(videoUrl)}
                  </p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {videoUrl}
                  </p>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => onVideoRemove(index)}
                  disabled={isLoading || isCurrentlyUploading}
                  className='ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
