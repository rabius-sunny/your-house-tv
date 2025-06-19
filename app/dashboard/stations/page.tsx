'use client';

import { useAsync } from '@/hooks/useAsync';
import StationComp from './Station';

type TProps = {};

export default function StationPage({}: TProps) {
  const { data } = useAsync('/channel');
  return (
    <div>
      <StationComp channels={data || []} />
    </div>
  );
}
