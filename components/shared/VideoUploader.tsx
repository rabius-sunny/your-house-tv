'use client';

import { uploadVideos } from '@/helper/videoUploader';
import { FileBuffer } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

type TProps = {
  setSelectedVideo: (videoUrl: string) => void;
  isLoading?: boolean;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  setIsLoading?: (loading: boolean) => void;
};

export default function VideoUploader({
  setSelectedVideo,
  isLoading,
  accept = 'video/*',
  maxSizeMB = 100, // 100MB default for videos
  multiple = false,
  setIsLoading
}: TProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

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
      const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
      if (selectedFile.size > maxSize) {
        toast.error('File too large', {
          description: `Please select a file smaller than ${maxSizeMB}MB`
        });
        return;
      }

      setFile(selectedFile);
      setIsUploading(true);
      setIsLoading?.(true);
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
          // existing file url for deleting previous file when updating
          ['']
        );

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadResult?.error || !uploadResult.data) {
          toast.error(uploadResult.error || 'Upload failed');
          return;
        }

        if (uploadResult.data?.length > 0) {
          setSelectedVideo(uploadResult.data[0]);
          toast.success('Video uploaded successfully!');
        } else {
          throw new Error('Failed to upload video');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload video');
      } finally {
        setIsUploading(false);
        setIsLoading?.(false);
        setUploadProgress(0);
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

  return (
    <div className='space-y-3'>
      <Input
        type='file'
        accept={accept}
        onChange={handleFileChange}
        disabled={isLoading || isUploading}
        multiple={multiple}
      />

      {isUploading && (
        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress
            value={uploadProgress}
            className='h-2 '
          />
        </div>
      )}

      {file && !isUploading && (
        <div className='p-3 bg-muted rounded-lg'>
          <p className='text-sm font-medium text-foreground'>
            Selected: {file.name}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            Size: {formatFileSize(file.size)} | Type: {file.type}
          </p>
        </div>
      )}

      <div className='text-xs text-muted-foreground'>
        <p>Supported formats: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV</p>
        <p>Maximum file size: {maxSizeMB}MB</p>
      </div>
    </div>
  );
}
