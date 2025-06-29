'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CardsSekeleton } from '@/components/ui/card-skeleton';
import { useAsync } from '@/hooks/useAsync';
import { Channel } from '@/types';
import { Play, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type TProps = {
  channelSlug?: string;
  currentStation: string;
};

export default function RelatedStations({
  channelSlug,
  currentStation
}: TProps) {
  const { data, loading, error } = useAsync<Channel>(
    channelSlug &&
      `/channel/public?slug=${channelSlug}&currentStation=${currentStation}`
  );
  if (loading) {
    return <CardsSekeleton />;
  }
  if (error || !data || !data?.stations?.length) {
    return null;
  }
  return (
    <div>
      <p className='uppercase text-center text-white font-medium mb-2'>
        Up Next in {channelSlug}
      </p>
      <div className='mt-4 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {data?.stations?.map((station, idx) => (
          <Link
            key={idx}
            href={`/stations/${station.slug}`}
            className='group block'
          >
            <Card className='p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white'>
              <CardContent className='p-0'>
                {/* Station Image */}
                <div className='relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden'>
                  {station.thumbnail ? (
                    <Image
                      src={station.thumbnail}
                      alt={station.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Play className='h-12 w-12 text-slate-400' />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>

                {/* Station Info */}
                <div className='p-4 pb-2'>
                  <h3 className='text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                    {station.name}
                  </h3>

                  {/* Station Stats */}
                  <div className='flex items-center justify-between text-xs text-slate-500'>
                    {station.isFeatured && (
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
  );
}
