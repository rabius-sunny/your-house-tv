'use client';

import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import { VlogCategory } from '@/types';
import { List, Plus } from 'lucide-react';
import { useState } from 'react';
import VlogForm from './VlogForm';
import VlogList from './VlogList';

type TProps = {
  categories: VlogCategory[];
};

export default function Vlogs({ categories }: TProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const { data: vlogs, refetch, loading } = useAsync('/vlogs');

  return (
    <div className='container mx-auto py-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-2'>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className='flex items-center gap-2'
          >
            <List className='h-4 w-4' />
            View Vlogs
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Create Vlog
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <VlogForm
          categories={categories}
          onSuccess={() => {
            setActiveTab('list');
            refetch();
          }}
        />
      ) : (
        <VlogList
          loading={loading}
          vlogs={vlogs || []}
          onVlogDeleted={refetch}
        />
      )}
    </div>
  );
}
