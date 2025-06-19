'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { VlogCategory } from '@/types';
import { Calendar, FileText, Star, Tag } from 'lucide-react';

type Props = {
  category: VlogCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CategoryDetailsDialog({
  category,
  open,
  onOpenChange
}: Props) {
  if (!category) return null;

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
              <Tag className='h-5 w-5 text-primary' />
            </div>
            Category Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4 overflow-y-auto max-h-[calc(85vh-8rem)]'>
          {/* Category Name */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-foreground'>
                {category.name}
              </h3>
              {category.isFeatured && (
                <Badge className='flex items-center gap-1'>
                  <Star className='h-3 w-3' />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
              <FileText className='h-4 w-4' />
              Description
            </div>
            <div className='bg-muted/30 rounded-lg p-3 border border-border/40'>
              <p className='text-sm text-foreground leading-relaxed'>
                {category.description ||
                  'No description provided for this category.'}
              </p>
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
                {formatDate(category.createdAt)}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                Last Updated
              </div>
              <p className='text-sm text-foreground font-mono bg-muted/30 rounded px-2 py-1'>
                {formatDate(category.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
