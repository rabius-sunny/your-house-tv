'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/useAsync';
import { City } from '@/types';
import { AlertCircle, MapPin, RefreshCw, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AllCities() {
  const { data, error, loading, refetch } = useAsync<City[]>('/city/public');

  // Loading skeleton
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='box py-20'>
          <div className='text-center mb-12'>
            <Skeleton className='h-12 w-96 mx-auto mb-4' />
            <Skeleton className='h-6 w-64 mx-auto' />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                className='overflow-hidden'
              >
                <CardContent className='p-0'>
                  <Skeleton className='h-48 w-full' />
                  <div className='p-4 space-y-3'>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-2/3' />
                  </div>
                </CardContent>
              </Card>
            ))}
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
                Failed to Load Cities
              </h2>
              <p className='text-red-600 mb-6'>
                We couldn't load the cities. Please check your connection and
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
  if (!data || data.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto'>
            <CardContent className='p-8 text-center'>
              <MapPin className='h-16 w-16 text-slate-400 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>
                No Cities Found
              </h2>
              <p className='text-slate-600 mb-6'>
                There are currently no cities available. Please check back
                later.
              </p>
              <Button
                onClick={refetch}
                variant='outline'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Refresh
              </Button>
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
            Cities
          </h1>
          <p className='text-lg text-slate-600 max-w-2xl mx-auto mb-6'>
            Explore cities and their local television channels. Discover content
            and programming specific to each location.
          </p>
          <div className='flex items-center justify-center gap-4 text-sm text-slate-500'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              <span>
                Showing {data.length} cit{data.length !== 1 ? 'ies' : 'y'}
              </span>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {data.map((city) => (
            <Link
              key={city.id}
              href={`/cities/${city.slug}`}
              className='group block'
            >
              <Card className='overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white'>
                <CardContent className='p-0'>
                  {/* City Image */}
                  <div className='relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden'>
                    {city.thumbnail ? (
                      <Image
                        src={city.thumbnail}
                        alt={city.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <MapPin className='h-16 w-16 text-slate-400' />
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>

                  {/* City Info */}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                      {city.name}
                    </h3>

                    {/* City Stats */}
                    <div className='flex items-center justify-between text-xs text-slate-500 mb-3'>
                      <span className='bg-slate-100 px-2 py-1 rounded-full'>
                        {city.channels?.length || 0} channel
                        {(city.channels?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      {city.isFeatured && (
                        <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full flex items-center gap-1'>
                          <Star className='h-3 w-3 fill-current' />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Network Info */}
                    {city.network && (
                      <div className='text-xs text-slate-600'>
                        <span className='font-medium'>Network:</span>
                        <div className='mt-1'>
                          <span className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs'>
                            {city.network.name}
                          </span>
                        </div>
                      </div>
                    )}
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
