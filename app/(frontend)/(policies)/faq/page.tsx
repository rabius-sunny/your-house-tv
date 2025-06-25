'use client';

import SectionHeader from '@/components/shared/SectionHeader';
import { useAsync } from '@/hooks/useAsync';
import parse from 'html-react-parser';

export default function Faq() {
  const { data, loading, error } = useAsync<string | null>('/settings?key=faq');

  return (
    <div>
      <SectionHeader title='FAQ' />
      <div className='my-20 box max-w-3xl'>
        {loading && (
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            <div className='h-4 bg-gray-200 rounded w-5/6'></div>
            <div className='h-4 bg-gray-200 rounded w-2/3'></div>
          </div>
        )}
        {error && (
          <div className='text-red-600 p-4 bg-red-50 rounded-lg border border-red-200'>
            <h3 className='font-medium mb-2'>Error loading content</h3>
            <p className='text-sm'>
              {error.message || 'Failed to load information'}
            </p>
          </div>
        )}
        {!loading && !error && !data && (
          <div className='text-gray-600 p-4 h-[30vh] flex items-center justify-center  rounded-lg border border-gray-200'>
            <h3 className='font-medium mb-2'>No content available</h3>
          </div>
        )}
        {!loading && !error && data && parse(data)}
      </div>
    </div>
  );
}
