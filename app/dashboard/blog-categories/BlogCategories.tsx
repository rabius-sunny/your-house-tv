'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { BlogCategory } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import BlogCategoryForm from './BlogCategoryForm';
import BlogCategoryList from './BlogCategoryList';

type TabType = 'list' | 'create';

export default function BlogCategories() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await request.get('/blog-category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryCreated = () => {
    fetchCategories();
    setActiveTab('list');
  };

  const handleCategoryDeleted = () => {
    fetchCategories();
  };

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
            className={`flex items-center gap-2 transition-all duration-200`}
          >
            <List className='h-4 w-4' />
            Categories
            {categories.length > 0 && (
              <span className='ml-1 px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground'>
                {categories.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 transition-all duration-200`}
          >
            <Plus className='h-4 w-4' />
            Create New
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'list' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <BlogCategoryList
              categories={categories}
              loading={loading}
              onCategoryDeleted={handleCategoryDeleted}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <BlogCategoryForm onCategoryCreated={handleCategoryCreated} />
          </div>
        )}
      </div>
    </div>
  );
}
