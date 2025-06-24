'use client';

import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import { BlogCategory } from '@/types';
import { List, Plus } from 'lucide-react';
import { useState } from 'react';
import BlogForm from './BlogForm';
import BlogList from './BlogList';

type TProps = {
  categories: BlogCategory[];
};

export default function Blogs({ categories }: TProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const { data: blogs, loading, refetch } = useAsync('/blogs');

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        {/* Tab Navigation */}
        <div className='flex items-center gap-2 bg-muted/30 rounded-lg p-1 border border-border/40'>
          <Button
            size='sm'
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('list')}
            className='flex items-center gap-2 transition-all duration-200'
          >
            <List className='h-4 w-4' />
            Blogs
            {blogs && blogs.length > 0 && (
              <span className='ml-1 px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground'>
                {blogs.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className='flex items-center gap-2 transition-all duration-200'
          >
            <Plus className='h-4 w-4' />
            Create New
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <BlogForm
          categories={categories}
          onSuccess={() => {
            setActiveTab('list');
            refetch();
          }}
        />
      ) : (
        <BlogList
          loading={loading}
          blogs={blogs || []}
          onBlogDeleted={refetch}
        />
      )}
    </div>
  );
}
