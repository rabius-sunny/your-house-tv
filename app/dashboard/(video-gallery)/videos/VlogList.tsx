'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { VlogCategory } from '@/types';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Vlog = {
  id: string;
  title: string;
  thumbnail: string;
  video: string;
  type: 'VLOG' | 'PODCAST';
  isFeatured: boolean;
  categories: VlogCategory[];
  createdAt: string;
  updatedAt: string;
};

type TProps = {
  vlogs: Vlog[];
  loading: boolean;
  onVlogDeleted: () => void;
};

export default function VlogList({ vlogs, loading, onVlogDeleted }: TProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VLOG' | 'PODCAST'>(
    'ALL'
  );

  // Filter vlogs based on selected type
  const filteredVlogs = vlogs.filter((vlog) => {
    if (typeFilter === 'ALL') return true;
    return vlog.type === typeFilter;
  });

  const handleDelete = async (vlogId: string) => {
    if (!confirm('Are you sure you want to delete this vlog?')) {
      return;
    }

    try {
      setDeletingId(vlogId);
      await request.delete(`/vlogs?id=${vlogId}`);
      toast.success('Vlog deleted successfully!');
      onVlogDeleted();
    } catch (error) {
      console.error('Error deleting vlog:', error);
      toast.error('Failed to delete vlog');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading Skeleton Component
  const VlogListSkeleton = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-5 w-32' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className='overflow-hidden p-0'
          >
            <div className='flex flex-col'>
              {/* Thumbnail Skeleton */}
              <div className='h-48'>
                <Skeleton className='w-full h-full' />
              </div>

              {/* Content Skeleton */}
              <div className='p-4 flex-1 flex flex-col'>
                <div className='mb-3'>
                  <Skeleton className='h-5 w-full mb-2' />
                  <Skeleton className='h-5 w-3/4 mb-2' />
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                </div>

                {/* Categories Skeleton */}
                <div className='flex flex-wrap gap-1 mb-4'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-14' />
                </div>

                {/* Actions Skeleton */}
                <div className='flex gap-2 mt-auto'>
                  <Skeleton className='h-8 flex-1' />
                  <Skeleton className='h-8 w-10' />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Show loading skeleton while loading
  if (loading) {
    return <VlogListSkeleton />;
  }

  if (vlogs.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <div className='text-center max-w-md'>
            <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No vlogs found</h3>
            <p className='text-muted-foreground'>
              Create your first vlog to get started. You can upload videos and
              organize them with categories.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Filter Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Filter by type:</span>
          <div className='flex gap-2'>
            <Button
              variant={typeFilter === 'ALL' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTypeFilter('ALL')}
              className='text-xs'
            >
              All ({vlogs.length})
            </Button>
            <Button
              variant={typeFilter === 'VLOG' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTypeFilter('VLOG')}
              className='text-xs'
            >
              Vlogs ({vlogs.filter((v) => v.type === 'VLOG').length})
            </Button>
            <Button
              variant={typeFilter === 'PODCAST' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTypeFilter('PODCAST')}
              className='text-xs'
            >
              Podcasts ({vlogs.filter((v) => v.type === 'PODCAST').length})
            </Button>
          </div>
        </div>
        <p className='text-muted-foreground text-sm'>
          Showing {filteredVlogs.length} of {vlogs.length} item
          {vlogs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* No filtered results */}
      {filteredVlogs.length === 0 && vlogs.length > 0 && (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <div className='text-center'>
              <h3 className='text-lg font-semibold mb-2'>
                No {typeFilter.toLowerCase()}s found
              </h3>
              <p className='text-muted-foreground mb-4'>
                Try selecting a different filter or create new content
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setTypeFilter('ALL')}
              >
                Show All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredVlogs.map((vlog) => (
          <Card
            key={vlog.id}
            className='overflow-hidden hover:shadow-lg transition-all duration-300 group p-0'
          >
            <div className='flex flex-col'>
              {/* Thumbnail */}
              <div className='h-48 relative overflow-hidden'>
                <img
                  src={vlog.thumbnail}
                  alt={vlog.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  loading='lazy'
                />
                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                {vlog.isFeatured && (
                  <Badge
                    variant='secondary'
                    className='absolute top-3 left-3 animate-pulse'
                  >
                    Featured
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className='p-4 flex-1 flex flex-col'>
                <div className='mb-3'>
                  <h3 className='text-lg font-semibold group-hover:text-primary transition-colors duration-200 mb-2 line-clamp-2'>
                    {vlog.title}
                  </h3>
                  <div className='flex items-center gap-2 mb-2'>
                    <Badge variant='outline'>{vlog.type}</Badge>
                    <span className='text-xs text-muted-foreground'>
                      {formatDate(vlog.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Categories */}
                {vlog.categories && vlog.categories.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-4'>
                    {vlog.categories.slice(0, 3).map((category) => (
                      <Badge
                        key={category.id}
                        variant='secondary'
                        className='hover:bg-primary/10 transition-colors duration-200 text-xs'
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {vlog.categories.length > 3 && (
                      <Badge
                        variant='secondary'
                        className='text-xs'
                      >
                        +{vlog.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className='flex gap-2 mt-auto'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => window.open(vlog.video, '_blank')}
                    className='flex items-center gap-1 hover:scale-105 transition-transform duration-200 flex-1'
                  >
                    <ExternalLink className='h-4 w-4' />
                    Watch
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(vlog.id)}
                    disabled={deletingId === vlog.id}
                    className='flex items-center gap-1 hover:scale-105 transition-transform duration-200 disabled:hover:scale-100'
                  >
                    {deletingId === vlog.id ? (
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <Trash2 className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
