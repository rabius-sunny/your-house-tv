'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Station } from '@/types';
import { Calendar, Clock, MapPin, Play, Star, Video } from 'lucide-react';

type StationDetailsDialogProps = {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StationDetailsDialog({
  station,
  open,
  onOpenChange
}: StationDetailsDialogProps) {
  if (!station) return null;

  const formatDateRange = (startedAt: Date, endedAt: Date) => {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const startStr = start.toLocaleDateString();
    const endStr = end.toLocaleDateString();

    if (startStr === endStr) {
      return {
        date: startStr,
        time: `${start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })} - ${end.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`
      };
    }
    return {
      date: `${startStr} - ${endStr}`,
      time: null
    };
  };

  const schedule = formatDateRange(station.startedAt, station.endedAt);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <img
              src={station.thumbnail || '/placeholder-image.png'}
              alt={station.name}
              className='w-12 h-12 object-cover rounded-lg'
            />
            <div>
              <h2 className='text-xl font-bold'>{station.name}</h2>
              <div className='flex items-center gap-2 mt-1'>
                <Badge variant={station.isFeatured ? 'default' : 'secondary'}>
                  {station.isFeatured ? 'Featured' : 'Regular'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Station Image */}
          <div className='aspect-video w-full overflow-hidden rounded-lg bg-muted'>
            <img
              src={station.thumbnail || '/placeholder-image.png'}
              alt={station.name}
              className='w-full h-full object-cover'
            />
          </div>

          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Play className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Channel:</span>
                <span className='font-medium'>
                  {station.channel?.name || 'N/A'}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <Video className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Videos:</span>
                <span className='font-medium'>
                  {station.videos?.length || 0}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <Star className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Featured:</span>
                <span className='font-medium'>
                  {station.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Schedule:</span>
                <span className='font-medium'>{schedule.date}</span>
              </div>

              {schedule.time && (
                <div className='flex items-center gap-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>Time:</span>
                  <span className='font-medium'>{schedule.time}</span>
                </div>
              )}

              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Created:</span>
                <span className='font-medium'>
                  {new Date(station.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Videos List */}
          {station.videos && station.videos.length > 0 && (
            <div>
              <h3 className='font-semibold mb-3'>
                Videos ({station.videos.length})
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {station.videos.map((videoUrl, index) => (
                  <div
                    key={index}
                    className='relative group overflow-hidden rounded-lg bg-muted'
                  >
                    <div className='aspect-video'>
                      <video
                        src={videoUrl}
                        className='w-full h-full object-cover'
                        preload='metadata'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <Play className='h-8 w-8 text-white' />
                      </div>
                    </div>
                    <div className='p-2'>
                      <p className='text-xs text-muted-foreground truncate'>
                        Video {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channel Information */}
          {station.channel && (
            <div>
              <h3 className='font-semibold mb-3'>Channel Details</h3>
              <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                <img
                  src={station.channel.thumbnail || '/placeholder-image.png'}
                  alt={station.channel.name}
                  className='w-12 h-12 object-cover rounded'
                />
                <div className='flex-1'>
                  <h4 className='font-medium text-sm'>
                    {station.channel.name}
                  </h4>
                  <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1'>
                    {station.channel.city && (
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3' />
                        <span>{station.channel.city.name}</span>
                      </div>
                    )}
                    {station.channel.isFeatured && (
                      <Badge
                        variant='secondary'
                        className='text-xs'
                      >
                        Featured Channel
                      </Badge>
                    )}
                  </div>
                  {station.channel.description && (
                    <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                      {station.channel.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Network & City Information */}
          {station.channel?.city?.network && (
            <div>
              <h3 className='font-semibold mb-3'>Network & City</h3>
              <div className='space-y-3'>
                {/* Network */}
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <img
                    src={
                      station.channel.city.network.thumbnail ||
                      '/placeholder-image.png'
                    }
                    alt={station.channel.city.network.name}
                    className='w-10 h-10 object-cover rounded'
                  />
                  <div>
                    <h4 className='font-medium text-sm'>
                      {station.channel.city.network.name}
                    </h4>
                    <p className='text-xs text-muted-foreground'>Network</p>
                  </div>
                </div>

                {/* City */}
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                  <img
                    src={
                      station.channel.city.thumbnail || '/placeholder-image.png'
                    }
                    alt={station.channel.city.name}
                    className='w-10 h-10 object-cover rounded'
                  />
                  <div>
                    <h4 className='font-medium text-sm'>
                      {station.channel.city.name}
                    </h4>
                    <p className='text-xs text-muted-foreground'>City</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
