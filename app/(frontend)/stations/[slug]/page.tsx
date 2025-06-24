'use client';

import StationPlayer from '@/components/shared/StationPlayer';
import { useAsync } from '@/hooks/useAsync';
import { useParams } from 'next/navigation';

export default function StationDetails() {
  const params = useParams();
  const { data, loading, error } = useAsync(
    `/station/public?slug=${params.slug}`
  );
  return (
    <div>
      <StationPlayer
        loading={loading}
        station={data}
      />
    </div>
  );
}
