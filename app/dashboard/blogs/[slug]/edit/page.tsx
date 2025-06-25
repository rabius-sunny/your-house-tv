'use client';

import BlogForm from '@/app/dashboard/blogs/BlogForm';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Blog, BlogCategory } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogSlug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch blog data and categories in parallel
        const [blogResponse, categoriesResponse] = await Promise.all([
          request.get(`/blogs?slug=${blogSlug}`),
          request.get('/blog-category')
        ]);

        if (!blogResponse.data) {
          throw new Error('Blog not found');
        }

        // Transform blog data to include categoryIds for the form
        const blogData = {
          ...blogResponse.data,
          categoryIds:
            blogResponse.data.categories?.map((cat: any) => cat.id) || []
        };

        setBlog(blogData);
        setCategories(categoriesResponse.data || []);
      } catch (error: any) {
        console.error('Error fetching blog data:', error);
        const errorMessage =
          error?.response?.data?.error || 'Failed to load blog data';
        setError(errorMessage);
        toast.error('Failed to load blog data', {
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    if (blogSlug) {
      fetchData();
    }
  }, [blogSlug]);

  const handleBlogUpdated = () => {
    toast.success('Blog updated successfully!');
    router.push('/dashboard/blogs');
  };

  // Loading state
  if (loading) {
    return (
      <div className='space-y-6'>
        {/* Header Skeleton */}
        <div className='flex items-center gap-4'>
          <Skeleton className='h-9 w-9' />
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className='max-w-2xl mx-auto'>
          <div className='border rounded-lg p-6 space-y-6'>
            <Skeleton className='h-6 w-40' />
            <div className='space-y-4'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='space-y-2'
                >
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
            <div className='flex gap-4'>
              <Skeleton className='h-10 flex-1' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <Link
            href='/dashboard/blogs'
            className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <h1 className='text-2xl font-bold'>Edit Blog</h1>
            <p className='text-sm text-muted-foreground'>
              Modify blog details and settings
            </p>
          </div>
        </div>

        {/* Error Message */}
        <div className='max-w-2xl mx-auto'>
          <div className='border border-destructive/20 rounded-lg p-6 bg-destructive/5'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-destructive'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-destructive'>
                  Error Loading Blog
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {error || 'Blog not found'}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <Link
                href='/dashboard/blogs'
                className='inline-flex items-center text-sm text-primary hover:underline'
              >
                ← Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/blogs'
          className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>Edit Blog</h1>
          <p className='text-sm text-muted-foreground'>
            Modify "{blog.title}" details and settings
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <BlogForm
        categories={categories}
        onSuccess={handleBlogUpdated}
        editBlog={blog}
      />
    </div>
  );
}
