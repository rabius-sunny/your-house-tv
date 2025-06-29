'use client';

import SponsorCarousel from '@/components/frontend/carousel/SponsorCarousel';
import Share from '@/components/frontend/Share';
import StationPlayer from '@/components/shared/StationPlayer';
import Background from '@/components/ui/bg';
import { useAsync } from '@/hooks/useAsync';
import { Station } from '@/types';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import RelatedStations from '../RelatedStations';

export default function StationDetails() {
  const params = useParams();
  const { data, loading, error } = useAsync<Station>(
    `/station/public?slug=${params.slug}`
  );

  return (
    <Background>
      <div className='py-20'>
        <StationPlayer
          loading={loading}
          station={data!}
        />
        <div className='box mt-10'>
          <div className='grid grid-cols-1 lg:grid-cols-4'>
            <div className='col-span-4 lg:col-span-3 text-slate-200'>
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
                <div className='mt-4'>{parse(data.description)}</div>
              )}
            </div>
            <div className='max-w-sm mx-auto lg:max-w-max  mt-10 lg:mt-0 col-span-4 lg:col-span-1'>
              <SponsorCarousel slides={data?.sponsors || []} />

              <div className='mt-10'>
                <Share />
              </div>
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
    </Background>
  );
}
