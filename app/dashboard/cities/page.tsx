'use client';

import { useAsync } from '@/hooks/useAsync';
import CityComp from './City';

type TProps = {};

export default function CityPage({}: TProps) {
  const { data } = useAsync('/network');
  return (
    <div>
      <CityComp networks={data || []} />
    </div>
  );
}
