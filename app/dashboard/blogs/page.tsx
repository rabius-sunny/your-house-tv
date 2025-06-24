'use client';

import { useAsync } from '@/hooks/useAsync';
import { BlogCategory } from '@/types';
import { useEffect, useState } from 'react';
import Blogs from './Blogs';

export default function BlogsPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const { data: categoriesData, loading: categoriesLoading } =
    useAsync<BlogCategory[]>('/blog-category');

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  if (categoriesLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Blog Posts</h1>
          <p className='text-muted-foreground mt-1'>Loading...</p>
        </div>
      </div>
    );
  }

  return <Blogs categories={categories} />;
}
