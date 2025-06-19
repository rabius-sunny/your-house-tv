'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Network } from '@/types';
import { Calendar, Image, Monitor, Star } from 'lucide-react';

type Props = {
  network: Network | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NetworkDetailsDialog({
  network,
  open,
  onOpenChange
}: Props) {
  if (!network) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-md mx-auto max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <Monitor className='h-5 w-5 text-primary' />
            </div>
            Network Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4 overflow-y-auto max-h-[calc(85vh-8rem)]'>
          {/* Network Name */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-foreground'>
                {network.name}
              </h3>
              {network.isFeatured && (
                <Badge className='flex items-center gap-1'>
                  <Star className='h-3 w-3' />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
              <Image className='h-4 w-4' />
              Thumbnail
            </div>
            <div className='bg-muted/30 rounded-lg p-3 border border-border/40'>
              <img
                src={network.thumbnail}
                alt={network.name}
                className='w-full max-w-xs mx-auto h-auto object-cover rounded border border-border/40'
                loading='lazy'
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className='grid grid-cols-1 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                Created
              </div>
              <p className='text-sm text-foreground font-mono bg-muted/30 rounded px-2 py-1'>
                {formatDate(network.createdAt)}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                Last Updated
              </div>
              <p className='text-sm text-foreground font-mono bg-muted/30 rounded px-2 py-1'>
                {formatDate(network.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
