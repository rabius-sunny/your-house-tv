'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { BlogCategory } from '@/types';
import { Calendar, FileText, Star, Tag } from 'lucide-react';
import Image from 'next/image';

type TProps = {
  category: BlogCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BlogCategoryDetailsDialog({
  category,
  open,
  onOpenChange
}: TProps) {
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
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <Tag className='h-6 w-6 text-primary' />
            Blog Category Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Category Header */}
          <div className='flex items-start gap-4 p-6 bg-muted/30 rounded-lg'>
            <div className='relative h-16 w-16 rounded-lg overflow-hidden bg-muted'>
              {category.thumbnail ? (
                <Image
                  src={category.thumbnail}
                  alt={category.name}
                  fill
                  className='object-cover'
                  sizes='64px'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <Tag className='h-8 w-8 text-muted-foreground' />
                </div>
              )}
            </div>
            <div className='flex-1 space-y-2'>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold'>{category.name}</h2>
                {category.isFeatured && (
                  <Badge className='bg-yellow-500/10 text-yellow-600 border-yellow-500/20'>
                    <Star className='h-3 w-3 mr-1 fill-current' />
                    Featured
                  </Badge>
                )}
              </div>
              <p className='text-muted-foreground'>
                Slug:{' '}
                <code className='bg-muted px-2 py-1 rounded text-sm'>
                  {category.slug}
                </code>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              Description
            </h3>
            <p className='text-muted-foreground bg-muted/30 p-4 rounded-lg'>
              {category.description}
            </p>
          </div>

          {/* Statistics */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
              <div className='flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2'>
                <FileText className='h-4 w-4' />
                <span className='text-sm font-medium'>Total Blogs</span>
              </div>
              <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                {category._count?.blogs || 0}
              </p>
            </div>

            <div className='bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='flex items-center gap-2 text-green-600 dark:text-green-400 mb-2'>
                <Calendar className='h-4 w-4' />
                <span className='text-sm font-medium'>Created</span>
              </div>
              <p className='text-sm font-semibold text-green-700 dark:text-green-300'>
                {formatDate(category.createdAt)}
              </p>
            </div>
          </div>

          {/* Recent Blogs (if available) */}
          {category.blogs && category.blogs.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Recent Blogs ({category.blogs.length})
              </h3>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {category.blogs.slice(0, 5).map((blog: any) => (
                  <div
                    key={blog.id}
                    className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors'
                  >
                    <div className='relative h-10 w-10 rounded overflow-hidden bg-muted'>
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          className='object-cover'
                          sizes='40px'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <FileText className='h-4 w-4 text-muted-foreground' />
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>{blog.title}</p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                    {blog.isFeatured && (
                      <Badge
                        variant='outline'
                        className='text-xs'
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                ))}
                {category.blogs.length > 5 && (
                  <p className='text-xs text-muted-foreground text-center py-2'>
                    and {category.blogs.length - 5} more blog
                    {category.blogs.length - 5 !== 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className='pt-4 border-t border-border'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Created:</span>
                <p className='font-medium'>{formatDate(category.createdAt)}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>Last Updated:</span>
                <p className='font-medium'>{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
