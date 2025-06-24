'use client';

import Background from '@/components/ui/bg';
import { useAsync } from '@/hooks/useAsync';
import { Blog, BlogCategory } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

// Extended Blog type for API response (includes additional fields)
interface BlogWithExtras extends Blog {
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt: string;
  author?: string;
  category?: BlogCategory;
}

export default function BlogsPage() {
  const { data, loading, error, refetch } = useAsync<Blog[]>('/blogs/public');

  return (
    <Background>
      <div className='container mx-auto px-4 py-16'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
            Our Blog
          </h1>
          <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
            Stay updated with the latest news, insights, and stories from our
            community
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className='text-center py-16'>
            <div className='bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl p-12 max-w-md mx-auto'>
              <h3 className='text-2xl font-bold text-red-300 mb-4'>
                Oops! Something went wrong
              </h3>
              <p className='text-red-200 mb-6'>{error}</p>
              <button
                onClick={refetch}
                className='px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-200 transition-colors'
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 animate-pulse'
              >
                <div className='aspect-video bg-white/20 rounded-lg mb-4' />
                <div className='h-4 bg-white/20 rounded mb-2' />
                <div className='h-4 bg-white/20 rounded w-3/4 mb-4' />
                <div className='h-3 bg-white/20 rounded w-1/2' />
              </div>
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && data && data?.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {data.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className='group'
              >
                <article className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105'>
                  {/* Featured Image */}
                  {(blog.featuredImage || blog.thumbnail) && (
                    <div className='aspect-video relative overflow-hidden'>
                      <Image
                        src={blog.featuredImage || blog.thumbnail}
                        alt={blog.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    </div>
                  )}

                  <div className='p-6'>
                    {/* Category */}
                    {(blog.category || blog.categories?.[0]) && (
                      <span className='inline-block px-3 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full mb-3'>
                        {blog.category?.name || blog.categories?.[0]?.name}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className='text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-300 transition-colors'>
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    {(blog.excerpt || blog.description) && (
                      <p className='text-gray-300 text-sm line-clamp-3 mb-4'>
                        {blog.excerpt || blog.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className='flex items-center justify-between text-xs text-gray-400'>
                      {blog.author && <span>By {blog.author}</span>}
                      <time>
                        {new Date(
                          blog.publishedAt || blog.createdAt
                        ).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* No blogs state */}
        {!loading && !error && data && data?.length === 0 && (
          <div className='text-center py-16'>
            <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 max-w-md mx-auto'>
              <h3 className='text-2xl font-bold text-white mb-4'>
                No Blogs Yet
              </h3>
              <p className='text-gray-300'>
                We're working on creating amazing content for you. Check back
                soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </Background>
  );
}
