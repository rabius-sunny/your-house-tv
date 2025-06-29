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
import { GripVertical, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

type TProps = {
  uploadedVideos: string[];
  onVideoRemove: (index: number) => void;
  onVideoReorder: (videos: string[]) => void;
  isLoading?: boolean;
  isCurrentlyUploading?: boolean;
};

type VideoItem = {
  id: string;
  url: string;
};

export default function VideoSorter({
  uploadedVideos,
  onVideoRemove,
  onVideoReorder,
  isLoading,
  isCurrentlyUploading
}: TProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
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

  return (
    <div>
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
