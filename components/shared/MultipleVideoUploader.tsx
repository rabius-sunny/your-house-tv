'use client';

import { uploadVideos } from '@/helper/videoUploader';
import { FileBuffer } from '@/types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Upload, Video } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

type VideoItem = {
  id: string;
  url: string;
};

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
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCurrentlyUploading, setIsCurrentlyUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Convert video URLs to stable video items with unique IDs
  const videoItems: VideoItem[] = uploadedVideos.map((url, index) => ({
    id: `video-${url.split('/').pop()?.split('?')[0]}-${index}`, // Use filename (without query params) + index for stable ID
    url
  }));

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = videoItems.findIndex((item) => item.id === active.id);
      const newIndex = videoItems.findIndex((item) => item.id === over?.id);

      const reorderedItems = arrayMove(videoItems, oldIndex, newIndex);
      const reorderedVideos = reorderedItems.map((item) => item.url);
      onVideoReorder(reorderedVideos);
    }

    setActiveId(null);
  };

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

  // Sortable Video Item Component
  const SortableVideoItem = ({
    videoUrl,
    index,
    id
  }: {
    videoUrl: string;
    index: number;
    id: string;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 p-3 bg-muted rounded-lg transition-all duration-200 ${
          isDragging
            ? 'opacity-50 shadow-lg scale-105 rotate-2'
            : 'hover:bg-muted/80 hover:shadow-md'
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 transition-colors'
        >
          <GripVertical className='h-4 w-4' />
        </div>

        {/* Video Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded'>
              {index + 1}
            </span>
            <p className='text-sm font-medium truncate'>
              {getVideoFileName(videoUrl)}
            </p>
          </div>
          <p className='text-xs text-muted-foreground truncate mt-1'>
            {videoUrl}
          </p>
        </div>

        {/* Delete Button */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => onVideoRemove(index)}
          disabled={isLoading || isCurrentlyUploading}
          className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    );
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
              Uploaded Videos ({uploadedVideos.length}) - Drag to reorder
            </Label>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={videoItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-2'>
                {videoItems.map((item, index) => (
                  <SortableVideoItem
                    key={item.id}
                    id={item.id}
                    videoUrl={item.url}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId
                ? (() => {
                    const activeItem = videoItems.find(
                      (item) => item.id === activeId
                    );
                    const activeIndex = videoItems.findIndex(
                      (item) => item.id === activeId
                    );
                    return activeItem ? (
                      <div className='flex items-center gap-3 p-3 bg-muted rounded-lg shadow-lg border-2 border-primary/20'>
                        <GripVertical className='h-4 w-4 text-muted-foreground' />
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded'>
                              {activeIndex + 1}
                            </span>
                            <p className='text-sm font-medium truncate'>
                              {getVideoFileName(activeItem.url)}
                            </p>
                          </div>
                          <p className='text-xs text-muted-foreground truncate mt-1'>
                            {activeItem.url}
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()
                : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}
