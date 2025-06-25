'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Blog, BlogCategory } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type TProps = {
  blogs: Blog[];
  categories: BlogCategory[];
  loading: boolean;
  onBlogDeleted: () => void;
};

export default function BlogList({
  blogs,
  categories,
  loading,
  onBlogDeleted
}: TProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (blogId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this blog? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setDeletingId(blogId);
      await request.delete(`/blogs?id=${blogId}`);
      toast.success('Blog deleted successfully');
      onBlogDeleted();
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to delete blog';
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (blog: Blog) => {
    router.push(`/dashboard/blogs/${blog.slug}/edit`);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading Skeleton
  const BlogCardSkeleton = () => (
    <Card className='p-0 overflow-hidden'>
      <div className='relative h-48 bg-muted animate-pulse'></div>
      <CardContent className='p-6'>
        <div className='space-y-3'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <div className='flex justify-between items-center pt-2'>
            <Skeleton className='h-5 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 text-muted-foreground'>
              <svg
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No blogs found</h3>
            <p className='text-muted-foreground'>
              Create your first blog post to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className='p-0 overflow-hidden hover:shadow-lg transition-all duration-300 group'
          >
            {/* Thumbnail */}
            <div className='relative h-48 bg-muted overflow-hidden'>
              {blog.thumbnail ? (
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <svg
                    className='h-16 w-16 text-muted-foreground'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
              )}

              {/* Featured Badge */}
              {blog.isFeatured && (
                <div className='absolute top-3 left-3'>
                  <Badge className='bg-yellow-500/90 text-yellow-900 border-yellow-600'>
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className='p-4 pt-0'>
              <div className='space-y-3'>
                {/* Title */}
                <div>
                  <h3 className='text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200'>
                    {blog.title}
                  </h3>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-xs text-muted-foreground'>
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Categories */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-4'>
                    {blog.categories.slice(0, 3).map((category) => (
                      <Badge
                        key={category.id}
                        variant='secondary'
                        className='hover:bg-primary/10 transition-colors duration-200 text-xs'
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {blog.categories.length > 3 && (
                      <Badge
                        variant='secondary'
                        className='text-xs'
                      >
                        +{blog.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className='flex items-center justify-between pt-2'>
                  <div className='flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(blog)}
                      className='h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600'
                      title='Edit blog'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(blog.id)}
                      disabled={deletingId === blog.id}
                      className='h-8 w-8 p-0  disabled:opacity-50'
                      title='Delete blog'
                    >
                      {deletingId === blog.id ? (
                        <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
