'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardsSekeleton } from '@/components/ui/card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/useAsync';
import { Network } from '@/types';
import { AlertCircle, RefreshCw, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AllNetworks() {
  const { data, error, loading, refetch } =
    useAsync<Network[]>('/network/public');

  // Loading skeleton
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='box py-20'>
          <div className='text-center mb-12'>
            <Skeleton className='h-12 bg-slate-200 w-96 mx-auto mb-4' />
            <Skeleton className='h-6 bg-slate-200 w-64 mx-auto' />
          </div>

          <CardsSekeleton className='mt-10' />
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
                Failed to Load Networks
              </h2>
              <p className='text-red-600 mb-6'>
                We couldn't load the networks. Please check your connection and
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
              <Tv className='h-16 w-16 text-slate-400 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>
                No Networks Found
              </h2>
              <p className='text-slate-600 mb-6'>
                There are currently no networks available. Please check back
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
            All Networks
          </h1>
          <div className='flex items-center justify-center gap-4 text-sm text-slate-500'>
            <div className='flex items-center gap-2'>
              <Tv className='h-4 w-4' />
              <span>
                Showing {data.length} network{data.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Networks Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {data.map((network) => (
            <Link
              key={network.id}
              href={`/networks/${network.slug}`}
              className='group block'
            >
              <Card className='overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white p-0'>
                <CardContent className='p-0'>
                  {/* Network Logo/Image */}
                  <div className='relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden'>
                    {network.thumbnail ? (
                      <Image
                        src={network.thumbnail}
                        alt={network.name}
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

                  {/* Network Info */}
                  <div className='p-6'>
                    <h3 className=' font-medium text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                      {network.name}
                    </h3>

                    {/* City count if available */}
                    {network.city && network.city.length > 0 && (
                      <div className='mt-3 text-sm text-slate-600'>
                        {network.city.length} cit
                        {network.city.length !== 1 ? 'ies' : 'y'}
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
