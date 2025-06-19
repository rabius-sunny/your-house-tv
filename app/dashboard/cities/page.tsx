'use client';

import { useAsync } from '@/hooks/useAsync';
import { baseUrl } from '@/lib/utils';
import CityComp from './City';

type TProps = {};

export default function NetworkPage({}: TProps) {
  const { data } = useAsync('/network');
  console.log('base url', baseUrl);
  return (
    <div>
      <CityComp networks={data || []} />
    </div>
  );
}
