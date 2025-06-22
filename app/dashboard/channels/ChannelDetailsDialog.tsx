'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Channel } from '@/types';
import { Calendar, MapPin, Star, Users } from 'lucide-react';

type ChannelDetailsDialogProps = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ChannelDetailsDialog({
  channel,
  open,
  onOpenChange
}: ChannelDetailsDialogProps) {
  if (!channel) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <img
              src={channel.thumbnail || '/placeholder-image.png'}
              alt={channel.name}
              className='w-12 h-12 object-cover rounded-lg'
            />
            <div>
              <h2 className='text-xl font-bold'>{channel.name}</h2>
              <div className='flex items-center gap-2 mt-1'>
                <Badge variant={channel.isFeatured ? 'default' : 'secondary'}>
                  {channel.isFeatured ? 'Featured' : 'Regular'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Channel Image */}
          <div className='aspect-video w-full overflow-hidden rounded-lg bg-muted'>
            <img
              src={channel.thumbnail || '/placeholder-image.png'}
              alt={channel.name}
              className='w-full h-full object-cover'
            />
          </div>

          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>City:</span>
                <span className='font-medium'>
                  {channel.city?.name || 'N/A'}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Stations:</span>
                <span className='font-medium'>
                  {channel.stations?.length || 0}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <Star className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Featured:</span>
                <span className='font-medium'>
                  {channel.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Created:</span>
                <span className='font-medium'>
                  {new Date(channel.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Updated:</span>
                <span className='font-medium'>
                  {new Date(channel.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {channel.description && (
            <div>
              <h3 className='font-semibold mb-2'>Description</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {channel.description}
              </p>
            </div>
          )}

          {/* Stations List */}
          {channel.stations && channel.stations.length > 0 && (
            <div>
              <h3 className='font-semibold mb-3'>
                Stations ({channel.stations.length})
              </h3>
              <div className='grid grid-cols-1 gap-3'>
                {channel.stations.map((station) => (
                  <div
                    key={station.id}
                    className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'
                  >
                    <img
                      src={station.thumbnail || '/placeholder-image.png'}
                      alt={station.name}
                      className='w-10 h-10 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm'>{station.name}</h4>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span>Videos: {station.videos?.length || 0}</span>
                        {station.isFeatured && (
                          <Badge
                            variant='secondary'
                            className='text-xs'
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Information */}
          {channel.city?.network && (
            <div>
              <h3 className='font-semibold mb-3'>Network</h3>
              <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                <img
                  src={
                    channel.city.network.thumbnail || '/placeholder-image.png'
                  }
                  alt={channel.city.network.name}
                  className='w-10 h-10 object-cover rounded'
                />
                <div>
                  <h4 className='font-medium text-sm'>
                    {channel.city.network.name}
                  </h4>
                  {channel.city.network.isFeatured && (
                    <Badge
                      variant='secondary'
                      className='text-xs mt-1'
                    >
                      Featured Network
                    </Badge>
                  )}
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
