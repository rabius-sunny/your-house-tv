'use client';

import { useAsync } from '@/hooks/useAsync';
import Vlogs from './Vlogs';

export default function VideoGallery() {
  const { data } = useAsync('/category');
  return (
    <div>
      <Vlogs categories={data || []} />
    </div>
  );
}
