'use client';

import SponsorCarousel from '@/components/frontend/carousel/SponsorCarousel';
import StationPlayer from '@/components/shared/StationPlayer';
import { useAsync } from '@/hooks/useAsync';
import { Sponsor, Station } from '@/types';
import parse from 'html-react-parser';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Suspense } from 'react';
import RelatedStations from '../RelatedStations';

export default function StationDetails() {
  const params = useParams();
  const { data, loading, error } = useAsync<Station>(
    `/station/public?slug=${params.slug}`
  );
  const { data: sponsors, loading: sponsorLoading } =
    useAsync<Sponsor[]>(`/sponsors`);
  if (error) {
    return notFound();
  }

  return (
    <div>
      <StationPlayer
        loading={loading}
        station={data!}
      />
      <div className='box'>
        <div className='grid grid-cols-1 lg:grid-cols-4'>
          <div className='col-span-4 lg:col-span-3'>
            <h1 className='font-semibold text-2xl'>{data?.name}</h1>
            <p className='mt-1'>
              <Link
                className='hover:underline'
                href={`/channels/${data?.channel?.slug}`}
              >
                {data?.channel?.name}
              </Link>
            </p>
            {data?.description && (
              <div className='mt-4 mb-10'>{parse(data.description)}</div>
            )}
          </div>
          <div className='col-span-4 lg:col-span-1'>
            {sponsorLoading ? (
              <div>Loading sponsors...</div>
            ) : (
              <SponsorCarousel slides={sponsors! || []} />
            )}
          </div>
        </div>
      </div>

      <div className='box mt-10'>
        <Suspense fallback={<div></div>}>
          <RelatedStations
            currentStation={params.slug as string}
            channelSlug={data?.channel?.slug}
          />
        </Suspense>
      </div>
    </div>
  );
}
