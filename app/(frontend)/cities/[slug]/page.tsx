'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/useAsync';
import { City } from '@/types';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Network,
  RefreshCw,
  Star,
  Tv,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function CityDetails() {
  const params = useParams();
  const router = useRouter();
  const {
    data: city,
    error,
    loading,
    refetch
  } = useAsync<City>('/city/public?slug=' + params.slug);

  // Loading skeleton
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='box py-8'>
          {/* Back button skeleton */}
          <Skeleton className='h-10 w-32 mb-8' />

          {/* Hero section skeleton */}
          <div className='mb-8'>
            <div className='flex flex-col lg:flex-row gap-8'>
              <div className='flex-1 order-2 lg:order-1 space-y-4'>
                <Skeleton className='h-12 w-3/4' />
                <Skeleton className='h-6 w-1/2' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-4/6' />
                </div>
                <div className='flex gap-4'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-24' />
                </div>
              </div>
              <Skeleton className='w-full lg:w-80 h-64 lg:h-80 rounded-lg order-1 lg:order-2' />
            </div>
          </div>

          {/* Channels section skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className='h-8 w-48' />
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className='space-y-3'
                  >
                    <Skeleton className='h-48 w-full rounded-lg' />
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                City Not Found
              </h2>
              <p className='text-red-600 mb-6'>
                The city you're looking for doesn't exist or has been removed.
              </p>
              <div className='flex gap-3 justify-center'>
                <Button
                  onClick={() => router.back()}
                  variant='outline'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Go Back
                </Button>
                <Button
                  onClick={refetch}
                  className='bg-red-600 hover:bg-red-700 text-white'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No data state
  if (!city) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <div className='box py-20'>
          <Card className='max-w-lg mx-auto'>
            <CardContent className='p-8 text-center'>
              <MapPin className='h-16 w-16 text-slate-400 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>
                City Not Found
              </h2>
              <p className='text-slate-600 mb-6'>
                We couldn't find the city you're looking for.
              </p>
              <Button
                onClick={() => router.push('/cities')}
                variant='outline'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                View All Cities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='box py-10 md:py-20'>
        {/* City Hero Section */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* City Info */}
            <div className='flex-1 order-2 lg:order-1'>
              <div className='flex items-start justify-between mb-4'>
                <h1 className='text-4xl md:text-5xl font-bold text-slate-800'>
                  {city.name}
                </h1>
                {city.isFeatured && (
                  <div className='flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium'>
                    <Star className='h-4 w-4 fill-current' />
                    Featured
                  </div>
                )}
              </div>

              {/* City Stats */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='bg-blue-100 p-2 rounded-lg'>
                    <Tv className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-slate-500'>Channels</p>
                    <p className='text-xl font-bold text-slate-800'>
                      {city.channels?.length || 0}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='bg-green-100 p-2 rounded-lg'>
                    <Users className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm text-slate-500'>Total Stations</p>
                    <p className='text-xl font-bold text-slate-800'>
                      {city.channels?.reduce(
                        (acc, channel) => acc + (channel.stations?.length || 0),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-2 rounded-lg'>
                    <Calendar className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <p className='text-sm text-slate-500'>Created</p>
                    <p className='text-xl font-bold text-slate-800'>
                      {new Date(city.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              {city.network && (
                <div className='bg-blue-50 p-4 rounded-lg mb-6'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Network className='h-5 w-5 text-blue-600' />
                    <span className='font-medium text-blue-800'>Network</span>
                  </div>
                  <Link
                    href={`/networks/${city.network.slug}`}
                    className='text-blue-700 hover:text-blue-800 font-medium transition-colors'
                  >
                    {city.network.name}
                  </Link>
                </div>
              )}

              {/* City Description */}
              <div className='bg-slate-50 p-4 rounded-lg'>
                <p className='text-slate-700 leading-relaxed'>
                  Welcome to {city.name}, featuring diverse television
                  programming and local content. Explore our channels and
                  discover the stations and shows available in this location.
                </p>
              </div>
            </div>

            {/* City Image */}
            <div className='relative w-full lg:w-80 h-64 lg:h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden order-1 lg:order-2'>
              {city.thumbnail ? (
                <Image
                  src={city.thumbnail}
                  alt={city.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 320px'
                  priority
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <MapPin className='h-24 w-24 text-slate-400' />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Channels Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl'>
              <Tv className='h-6 w-6 text-blue-600' />
              Channels in {city.name}
              {city.channels && city.channels.length > 0 && (
                <span className='text-sm font-normal text-slate-500 ml-2'>
                  ({city.channels.length} channel
                  {city.channels.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!city.channels || city.channels.length === 0 ? (
              <div className='text-center py-12'>
                <Tv className='h-16 w-16 text-slate-300 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-slate-600 mb-2'>
                  No Channels Available
                </h3>
                <p className='text-slate-500'>
                  This city doesn't have any channels configured yet.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {city.channels
                  .sort((a, b) => {
                    // Sort by sortOrder if available, then by name
                    if (a.sortOrder !== null && b.sortOrder !== null) {
                      return (a.sortOrder || 0) - (b.sortOrder || 0);
                    }
                    if (a.sortOrder !== null) return -1;
                    if (b.sortOrder !== null) return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((channel) => (
                    <Link
                      key={channel.id}
                      href={`/channels/${channel.slug}`}
                      className='group block'
                    >
                      <Card className='overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white'>
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
                                <Tv className='h-12 w-12 text-slate-400' />
                              </div>
                            )}

                            {/* Overlay gradient */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                          </div>

                          {/* Channel Info */}
                          <div className='p-4'>
                            <h3 className='text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                              {channel.name}
                            </h3>

                            {channel.description && (
                              <p className='text-slate-600 text-sm line-clamp-2 mb-3'>
                                {channel.description}
                              </p>
                            )}

                            {/* Channel Stats */}
                            <div className='flex items-center justify-between text-xs text-slate-500 mb-3'>
                              <span className='bg-slate-100 px-2 py-1 rounded-full'>
                                {channel.stations?.length || 0} station
                                {(channel.stations?.length || 0) !== 1
                                  ? 's'
                                  : ''}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
