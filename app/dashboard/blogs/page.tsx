'use client';

import { useAsync } from '@/hooks/useAsync';
import { BlogCategory } from '@/types';
import { useEffect, useState } from 'react';
import Blogs from './Blogs';

export default function BlogsPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const { data: categoriesData, loading } =
    useAsync<BlogCategory[]>('/blog-category');

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  return (
    <Blogs
      catLoading={loading}
      categories={categories}
    />
  );
}
