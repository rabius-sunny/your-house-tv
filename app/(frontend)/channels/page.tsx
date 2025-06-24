'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardsSekeleton } from '@/components/ui/card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/useAsync';
import { Channel } from '@/types';
import { AlertCircle, RefreshCw, Star, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ChannelsPage() {
  const {
    data: channels,
    error,
    loading,
    refetch
  } = useAsync<Channel[]>('/channel/public');

  // Loading skeleton
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='box py-20'>
          <div className='text-center mb-12'>
            <Skeleton className='h-12 bg-slate-200 w-96 mx-auto mb-4' />
            <Skeleton className='h-6 bg-slate-200 w-64 mx-auto' />
            <CardsSekeleton className='mt-10' />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto border-red-200 bg-red-50'>
            <CardContent className='p-8 text-center'>
              <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-red-800 mb-2'>
                Failed to Load Channels
              </h2>
              <p className='text-red-600 mb-6'>
                We couldn't load the channels. Please check your connection and
                try again.
              </p>
              <Button
                onClick={refetch}
                className='bg-red-600 hover:bg-red-700 text-white'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Empty state
  if (!channels || channels.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto'>
            <CardContent className='p-8 text-center'>
              <Tv className='h-16 w-16 text-slate-400 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>
                No Channels Found
              </h2>
              <p className='text-slate-600 mb-6'>
                There are currently no channels available. Please check back
                later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='box py-20'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-slate-800 mb-4'>
            All Channels
          </h1>
          <div className='flex items-center justify-center gap-4 text-sm text-slate-500'>
            <div className='flex items-center gap-2'>
              <Tv className='h-4 w-4' />
              <span>
                Showing {channels.length} channel
                {channels.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {channels.map((channel, idx) => (
            <Link
              key={idx}
              href={`/channels/${channel.slug}`}
              className='group block'
            >
              <Card className='p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white'>
                <CardContent className='p-0'>
                  {/* Channel Image */}
                  <div className='relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden'>
                    {channel.thumbnail ? (
                      <Image
                        src={channel.thumbnail}
                        alt={channel.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <Tv className='h-16 w-16 text-slate-400' />
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>

                  {/* Channel Info */}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                      {channel.name}
                    </h3>

                    {channel.description && (
                      <p className='text-slate-600 text-sm line-clamp-2 mb-3'>
                        {channel.description}
                      </p>
                    )}

                    {/* Channel Stats */}
                    <div className='flex items-center justify-between text-xs text-slate-500'>
                      <span className='bg-slate-100 px-2 py-1 rounded-full'>
                        {channel.stations?.length || 0} station
                        {(channel.stations?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      {channel.isFeatured && (
                        <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full flex items-center gap-1'>
                          <Star className='h-3 w-3 fill-current' />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
