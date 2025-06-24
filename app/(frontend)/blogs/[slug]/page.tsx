'use client';

import Background from '@/components/ui/bg';
import { useAsync } from '@/hooks/useAsync';
import { Blog } from '@/types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BlogDetailsPage() {
  const params = useParams();
  const { data, loading, error, refetch } = useAsync<Blog>(
    `/blogs/public?slug=${params.slug}`
  );

  return (
    <Background>
      <div className='box max-w-7xl'>
        {/* Back Button */}
        <div className='mb-8'>
          <Link
            href='/blogs'
            className='inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Blogs
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className='text-center py-16'>
            <div className='bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl p-12 max-w-md mx-auto'>
              <h3 className='text-2xl font-bold text-red-300 mb-4'>
                Blog Not Found
              </h3>
              <p className='text-red-200 mb-6'>{error}</p>
              <div className='flex gap-4 justify-center'>
                <button
                  onClick={refetch}
                  className='px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-200 transition-colors'
                >
                  Try Again
                </button>
                <Link
                  href='/blogs'
                  className='px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors'
                >
                  Back to Blogs
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='animate-pulse'>
            {/* Header Skeleton */}
            <div className='mb-12'>
              <div className='h-6 bg-white/20 rounded w-32 mb-4' />
              <div className='h-16 bg-white/20 rounded w-3/4 mb-6' />
              <div className='flex gap-6 mb-6'>
                <div className='h-4 bg-white/20 rounded w-24' />
                <div className='h-4 bg-white/20 rounded w-32' />
              </div>
              <div className='h-6 bg-white/20 rounded w-full mb-2' />
              <div className='h-6 bg-white/20 rounded w-2/3' />
            </div>

            {/* Image Skeleton */}
            <div className='aspect-video bg-white/20 rounded-2xl mb-12' />

            {/* Content Skeleton */}
            <div className='max-w-4xl mx-auto'>
              <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12'>
                <div className='space-y-4'>
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className='h-4 bg-white/20 rounded w-full'
                    />
                  ))}
                  <div className='h-4 bg-white/20 rounded w-3/4' />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        {!loading && !error && data && <BlogContent blog={data} />}
      </div>
    </Background>
  );
}

function BlogContent({ blog }: { blog: Blog }) {
  return (
    <>
      {/* Article Header */}
      <header className='mb-12'>
        {/* Category */}
        {blog.categories && blog.categories.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {blog.categories.map((category, index) => (
              <span
                key={category.id || index}
                className='inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-full'
              >
                <Tag className='w-3 h-3' />
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className='text-2xl md:text-4xl font-bold text-white mb-6 leading-tight'>
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className='flex flex-wrap items-center gap-6 text-gray-400 text-sm'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4' />
            <time>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.thumbnail && (
        <div className='mb-12'>
          <div className='relative aspect-video rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20'>
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 1200px'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className='text-gray-100 leading-8 tracking-wide'>
        {blog?.description}
      </div>

      {/* Navigation */}
      <div className='mt-16 flex justify-center'>
        <Link
          href='/blogs'
          className='inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-200 shadow-lg'
        >
          <ArrowLeft className='w-5 h-5' />
          View All Blogs
        </Link>
      </div>

      {/* Related/Suggested Content */}
      <div className='mt-20 pb-20 text-center'>
        <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8'>
          <h3 className='text-2xl font-bold text-white mb-4'>
            Want to read more?
          </h3>
          <p className='text-gray-300 mb-6'>
            Discover more stories and insights from our blog
          </p>
          <Link
            href='/blogs'
            className='inline-flex items-center px-6 py-3 bg-red-500/20 text-red-300 rounded-full font-medium hover:bg-red-500/30 transition-colors duration-200'
          >
            Explore More Blogs
          </Link>
        </div>
      </div>
    </>
  );
}
