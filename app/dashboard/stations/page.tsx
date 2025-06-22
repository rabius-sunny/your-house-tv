'use client';

import { useAsync } from '@/hooks/useAsync';
import Stations from './Stations';

type TProps = {};

export default function StationPage({}: TProps) {
  const { data } = useAsync('/channel');
  return (
    <div>
      <Stations channels={data || []} />
    </div>
  );
}
