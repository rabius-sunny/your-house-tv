'use client';

import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import { Vlog, VlogCategory } from '@/types';
import { List, Plus } from 'lucide-react';
import { useState } from 'react';
import VlogForm from './VlogForm';
import VlogList from './VlogList';

type TProps = {
  categories: VlogCategory[];
};

export default function Vlogs({ categories }: TProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>(
    'list'
  );
  const [editingVlog, setEditingVlog] = useState<Vlog | null>(null);
  const { data: vlogs, refetch, loading } = useAsync('/vlogs');

  const handleEdit = (vlog: Vlog) => {
    setEditingVlog(vlog);
    setActiveTab('edit');
  };

  const handleVlogUpdated = () => {
    setActiveTab('list');
    setEditingVlog(null);
    refetch();
  };

  return (
    <div className='container mx-auto py-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-2'>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => {
              setActiveTab('list');
              setEditingVlog(null);
            }}
            className='flex items-center gap-2'
          >
            <List className='h-4 w-4' />
            View Videos
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => {
              setActiveTab('create');
              setEditingVlog(null);
            }}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Create Video
          </Button>
          {activeTab === 'edit' && (
            <div className='text-muted-foreground flex items-center'>
              Editing: {editingVlog?.title}
            </div>
          )}
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
      ) : activeTab === 'edit' ? (
        <VlogForm
          categories={categories}
          editVlog={editingVlog}
          onSuccess={handleVlogUpdated}
        />
      ) : (
        <VlogList
          loading={loading}
          vlogs={vlogs || []}
          onVlogDeleted={refetch}
          onVlogEdit={handleEdit}
        />
      )}
    </div>
  );
}
