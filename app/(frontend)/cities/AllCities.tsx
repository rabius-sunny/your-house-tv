'use client';

import Background from '@/components/ui/bg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <Background>
        <div className='box py-20'>
          {/* Header Skeleton */}
          <div className='text-center mb-12'>
            <div className='w-80 h-12 bg-white/10 rounded animate-pulse mx-auto mb-4'></div>
            <div className='w-48 h-6 bg-white/10 rounded animate-pulse mx-auto'></div>
          </div>

          {/* Cities Grid Skeleton */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className='bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden'
              >
                {/* Image Skeleton */}
                <div className='h-48 bg-white/10 animate-pulse'></div>

                {/* Content Skeleton */}
                <div className='p-6'>
                  <div className='w-3/4 h-5 bg-white/10 rounded animate-pulse mb-2'></div>
                  <div className='w-1/2 h-4 bg-white/10 rounded animate-pulse mb-3'></div>
                  <div className='w-2/3 h-4 bg-white/10 rounded animate-pulse'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Background>
    );
  }

  // Error state
  if (error) {
    return (
      <Background>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20'>
            <CardContent className='p-8 text-center'>
              <AlertCircle className='h-16 w-16 text-red-400 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-white mb-2'>
                Failed to Load Cities
              </h2>
              <p className='text-white/70 mb-6'>
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
      </Background>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Background>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20'>
            <CardContent className='p-8 text-center'>
              <MapPin className='h-16 w-16 text-white/60 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-white mb-2'>
                No Cities Found
              </h2>
              <p className='text-white/70 mb-6'>
                There are currently no cities available. Please check back
                later.
              </p>
            </CardContent>
          </Card>
        </div>
      </Background>
    );
  }

  // Success state with data
  return (
    <Background>
      <div className='box py-20'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Cities
          </h1>
          <div className='flex items-center justify-center gap-4 text-sm text-white/70'>
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
              <Card className='p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/10 backdrop-blur-md border border-white/20'>
                <CardContent className='p-0'>
                  {/* City Image */}
                  <div className='relative h-48 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden'>
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
                        <MapPin className='h-16 w-16 text-white/60' />
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>

                  {/* City Info */}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200'>
                      {city.name}
                    </h3>

                    {/* City Stats */}
                    <div className='flex items-center justify-between text-xs text-white/70 mb-3'>
                      <span className='bg-white/10 px-2 py-1 rounded-full'>
                        {city._count.channels || 0} channel
                        {(city._count.channels || 0) !== 1 ? 's' : ''}
                      </span>
                      {city.isFeatured && (
                        <span className='bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1'>
                          <Star className='h-3 w-3 fill-current' />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Network Info */}
                    {city.network && (
                      <div className='text-xs text-white/70'>
                        <span className='font-medium'>Network:</span>
                        <div className='mt-1'>
                          <span className='bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs'>
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
    </Background>
  );
}
