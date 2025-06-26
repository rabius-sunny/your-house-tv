'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Sliders } from '@/types';
import Image from 'next/image';

type TProps = {
  slider: Sliders[0] | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export default function SliderDetailsDialog({
  slider,
  isOpen,
  onClose,
  title = 'Slider'
}: TProps) {
  if (!slider) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {title} Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Hero Image */}
          <div className='relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted'>
            <Image
              src={slider.image}
              alt={slider.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 896px'
            />
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>Title</h3>
              <p className='text-foreground'>{slider.title}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>Subtitle</h3>
              <p className='text-muted-foreground'>{slider.subtitle}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <p className='text-muted-foreground leading-relaxed'>
                {slider.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
            <Button
              variant='destructive'
              onClick={onClose}
              className='sm:ml-auto'
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
