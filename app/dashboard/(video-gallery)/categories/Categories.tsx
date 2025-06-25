'use client';

import { Button } from '@/components/ui/button';
import request from '@/services/http';
import { VlogCategory } from '@/types';
import { List, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';

type TabType = 'list' | 'create';

export default function Categories() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [categories, setCategories] = useState<VlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await request.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  return (
    <div className='space-y-6'>
      {/* Header with Tabs */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
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
            <CategoryList
              categories={categories}
              loading={loading}
              onCategoryDeleted={handleCategoryDeleted}
              onCategoryUpdated={handleCategoryUpdated}
            />
          </div>
        )}

        {activeTab === 'create' && (
          <div className='animate-in fade-in-0 slide-in-from-right-1 duration-300'>
            <CategoryForm onCategoryCreated={handleCategoryCreated} />
          </div>
        )}
      </div>
    </div>
  );
}
