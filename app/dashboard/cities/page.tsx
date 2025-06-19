'use client';

import { useAsync } from '@/hooks/useAsync';
import { baseUrl } from '@/lib/utils';
import CityComp from './City';

type TProps = {};

export default function NetworkPage({}: TProps) {
  // const data = await fetch(baseUrl + '/api/network', {
  //   next: { tags: ['cities'] }
  // });
  // if (!data.ok) {
  //   return <div>Error on fetching cities</div>;
  // }
  // const networks = await data.json();
  const { data } = useAsync(baseUrl + '/api/network');
  return (
    <div>
      <CityComp networks={data || []} />
    </div>
  );
}
