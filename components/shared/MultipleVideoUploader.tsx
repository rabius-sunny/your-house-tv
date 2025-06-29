'use client';

import { uploadVideos } from '@/helper/videoUploader';
import { FileBuffer } from '@/types';

import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import VideoSorter from './VideoSorter';

type TProps = {
  uploadedVideos: string[];
  onVideoAdd: (videoUrl: string) => void;
  onVideoRemove: (index: number) => void;
  onVideoReorder: (videos: string[]) => void;
  isLoading?: boolean;
  accept?: string;
  maxSizeMB?: number;
  setIsUploading?: (loading: boolean) => void;
};

export default function MultipleVideoUploader({
  uploadedVideos,
  onVideoAdd,
  onVideoRemove,
  onVideoReorder,
  isLoading,
  accept = 'video/*',
  maxSizeMB = 1024,
  setIsUploading
}: TProps) {
  const [currentFiles, setCurrentFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCurrentlyUploading, setIsCurrentlyUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    total: number;
    completed: number;
    currentFile: string;
  }>({ total: 0, completed: 0, currentFile: '' });

  console.log('isCurrentlyUploading', isCurrentlyUploading);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
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

      const maxSize = maxSizeMB * 1024 * 1024;
      const filesArray = Array.from(selectedFiles);

      // Validate all files before uploading
      for (const file of filesArray) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`, {
            description:
              'Please select valid video files (MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV)'
          });
          return;
        }

        if (file.size > maxSize) {
          toast.error(`File too large: ${file.name}`, {
            description: `Please select files smaller than ${maxSizeMB}MB`
          });
          return;
        }
      }

      setCurrentFiles(selectedFiles);
      setIsCurrentlyUploading(true);
      setIsUploading?.(true);
      setUploadProgress(0);
      setUploadStatus({
        total: filesArray.length,
        completed: 0,
        currentFile: ''
      });

      try {
        // Upload files one by one to show progress
        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];
          setUploadStatus((prev) => ({ ...prev, currentFile: file.name }));

          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const baseProgress = (i / filesArray.length) * 100;
              const fileProgress =
                (prev - baseProgress) / (100 / filesArray.length);
              if (fileProgress >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return (
                baseProgress + Math.min(fileProgress + Math.random() * 10, 90)
              );
            });
          }, 500);

          const fileBuffer = await convertFileToBuffer(file);
          const uploadResult = await uploadVideos([fileBuffer], ['']);

          clearInterval(progressInterval);

          if (uploadResult?.error || !uploadResult.data) {
            toast.error(
              `Failed to upload ${file.name}: ${
                uploadResult.error || 'Upload failed'
              }`
            );
            continue;
          }

          if (uploadResult.data?.length > 0) {
            onVideoAdd(uploadResult.data[0]);
            setUploadStatus((prev) => ({
              ...prev,
              completed: prev.completed + 1
            }));

            // Update progress to show completion of this file
            setUploadProgress(((i + 1) / filesArray.length) * 100);
          }
        }

        if (uploadStatus.completed === filesArray.length) {
          toast.success(
            `Successfully uploaded ${filesArray.length} video${
              filesArray.length > 1 ? 's' : ''
            }!`
          );
        } else if (uploadStatus.completed > 0) {
          toast.success(
            `Successfully uploaded ${uploadStatus.completed} out of ${filesArray.length} videos`
          );
        } else {
          toast.error('Failed to upload videos');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload videos');
      } finally {
        setIsCurrentlyUploading(false);
        setIsUploading?.(false);
        setUploadProgress(0);
        setCurrentFiles(null);
        setUploadStatus({ total: 0, completed: 0, currentFile: '' });
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

  return (
    <div className='space-y-4'>
      {/* Upload Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Upload className='h-4 w-4' />
          <Label>Upload Videos (Multiple Selection)</Label>
        </div>

        <Input
          type='file'
          accept={accept}
          multiple
          onChange={handleFileChange}
          disabled={isLoading || isCurrentlyUploading}
        />

        {isCurrentlyUploading && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>
                Uploading {uploadStatus.currentFile}... (
                {uploadStatus.completed + 1} of {uploadStatus.total})
              </span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress
              value={uploadProgress}
              className='h-2'
            />
            {uploadStatus.total > 1 && (
              <div className='text-xs text-muted-foreground'>
                Completed: {uploadStatus.completed} / {uploadStatus.total} files
              </div>
            )}
          </div>
        )}

        {currentFiles && !isCurrentlyUploading && (
          <div className='p-3 bg-muted rounded-lg'>
            <p className='text-sm font-medium text-foreground'>
              Selected: {currentFiles.length} file
              {currentFiles.length > 1 ? 's' : ''}
            </p>
            <div className='text-xs text-muted-foreground mt-1 space-y-1'>
              {Array.from(currentFiles).map((file, index) => (
                <div
                  key={index}
                  className='flex justify-between'
                >
                  <span className='truncate'>{file.name}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='text-xs text-muted-foreground'>
          <p>Supported formats: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV</p>
          <p>Maximum file size: {maxSizeMB}MB per file</p>
          <p>You can select multiple videos at once</p>
        </div>
      </div>

      {/* Video Sorter Section */}
      {uploadedVideos.length > 0 && (
        <VideoSorter
          uploadedVideos={uploadedVideos}
          onVideoRemove={onVideoRemove}
          onVideoReorder={onVideoReorder}
          isLoading={isLoading}
          isCurrentlyUploading={isCurrentlyUploading}
        />
      )}
    </div>
  );
}
