'use client';

import CreateStationComp from '@/app/dashboard/stations/CreateStation';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Channel, Station } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditStationPage() {
  const params = useParams();
  const router = useRouter();
  const stationSlug = params.slug as string;

  const [station, setStation] = useState<Station | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch station data and channels in parallel
        const [stationResponse, channelsResponse] = await Promise.all([
          request.get(`/station?slug=${stationSlug}`),
          request.get('/channel')
        ]);

        if (!stationResponse.data) {
          throw new Error('Station not found');
        }

        setStation(stationResponse.data);
        setChannels(channelsResponse.data || []);
      } catch (error: any) {
        console.error('Error fetching station data:', error);
        const errorMessage =
          error?.response?.data?.error || 'Failed to load station data';
        setError(errorMessage);
        toast.error('Failed to load station data', {
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    if (stationSlug) {
      fetchData();
    }
  }, [stationSlug]);

  const handleStationUpdated = () => {
    toast.success('Station updated successfully!');
    router.push('/dashboard/stations');
  };

  // Loading state
  if (loading) {
    return (
      <div className='space-y-6'>
        {/* Header Skeleton */}
        <div className='flex items-center gap-4'>
          <Skeleton className='h-9 w-9' />
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className='max-w-3xl mx-auto'>
          <div className='border rounded-lg p-6 space-y-6'>
            <Skeleton className='h-6 w-40' />
            <div className='space-y-4'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='space-y-2'
                >
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
            <div className='flex gap-4'>
              <Skeleton className='h-10 flex-1' />
              <Skeleton className='h-10 flex-1' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !station) {
    return (
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <Link
            href='/dashboard/stations'
            className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <h1 className='text-2xl font-bold'>Edit Station</h1>
            <p className='text-sm text-muted-foreground'>
              Modify station details and settings
            </p>
          </div>
        </div>

        {/* Error Message */}
        <div className='max-w-3xl mx-auto'>
          <div className='border border-destructive/20 rounded-lg p-6 bg-destructive/5'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-destructive'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-destructive'>
                  Error Loading Station
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {error || 'Station not found'}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <Link
                href='/dashboard/stations'
                className='inline-flex items-center text-sm text-primary hover:underline'
              >
                ← Back to Stations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/stations'
          className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>Edit Station</h1>
          <p className='text-sm text-muted-foreground'>
            Modify "{station.name}" details and settings
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <CreateStationComp
        channels={channels}
        onCreate={handleStationUpdated}
        editStation={station}
      />
    </div>
  );
}
