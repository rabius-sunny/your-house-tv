'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Sponsor } from '@/types';
import { ExternalLink, Globe, Radio } from 'lucide-react';
import Image from 'next/image';

type SponsorDetailsDialogProps = {
  sponsor: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function SponsorDetailsDialog({
  sponsor,
  isOpen,
  onClose
}: SponsorDetailsDialogProps) {
  if (!sponsor) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Sponsor Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Sponsor Logo */}
          <div className='flex justify-center'>
            <div className='relative h-32 w-32 rounded-xl overflow-hidden bg-muted border'>
              <Image
                src={sponsor.thumbnail}
                alt={sponsor.name}
                fill
                className='object-cover'
                sizes='128px'
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className='space-y-4'>
            <div className='text-center space-y-2'>
              <h2 className='text-3xl font-bold'>{sponsor.name}</h2>
              <Badge
                variant='secondary'
                className='text-sm'
              >
                {sponsor.designation}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Website Information */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Globe className='h-5 w-5 text-muted-foreground' />
              <span className='font-medium'>Website</span>
            </div>
            <div className='pl-7'>
              <a
                href={sponsor.website}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-primary hover:underline'
              >
                <span className='break-all'>{sponsor.website}</span>
                <ExternalLink className='h-4 w-4 flex-shrink-0' />
              </a>
            </div>
          </div>

          <Separator />

          {/* Associated Stations */}
          {sponsor.station && sponsor.station.length > 0 && (
            <>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Radio className='h-5 w-5 text-muted-foreground' />
                  <span className='font-medium'>Associated Stations</span>
                  <Badge
                    variant='secondary'
                    className='text-xs'
                  >
                    {sponsor.station.length}
                  </Badge>
                </div>
                <div className='pl-7'>
                  <div className='grid gap-2'>
                    {sponsor.station.map((station, index) => (
                      <div
                        key={station.id || index}
                        className='flex items-center gap-2 p-2 bg-muted/50 rounded-md'
                      >
                        <Radio className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm font-medium'>
                          {station.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              variant='outline'
              onClick={() => window.open(sponsor.website, '_blank')}
              className='flex-1'
            >
              <Globe className='h-4 w-4 mr-2' />
              Visit Website
            </Button>
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1'
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
