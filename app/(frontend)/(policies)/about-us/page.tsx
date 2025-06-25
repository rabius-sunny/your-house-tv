'use client';

import SectionHeader from '@/components/shared/SectionHeader';
import { useAsync } from '@/hooks/useAsync';

export default function AboutUs() {
  const { data, loading, error } = useAsync<string | null>(
    '/settings?key=about_us'
  );
  console.log('data', data);
  return (
    <div>
      <SectionHeader title='About Us' />
    </div>
  );
}
