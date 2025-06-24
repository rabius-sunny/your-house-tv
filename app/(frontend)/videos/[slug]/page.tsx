'use client';

import { VideoPlayer } from '@/components/SimpleVideoPlayer';
import { useAsync } from '@/hooks/useAsync';
import { Vlog } from '@/types';
import { ArrowLeft, Calendar, Heart, Share2, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function VideoDetails() {
  const params = useParams();
  const {
    data: video,
    loading,
    error
  } = useAsync<Vlog>(`/vlogs/public?slug=${params.slug}`);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>

        {/* Navigation Skeleton */}
        <div className='relative z-10 px-6 py-8'>
          <div className='w-32 h-6 bg-white/10 rounded animate-pulse mb-8'></div>

          {/* Main Content Skeleton */}
          <div className='max-w-7xl mx-auto'>
            {/* Video Player Skeleton - Full Width */}
            <div className='mb-8'>
              <div className='w-full aspect-video bg-white/10 rounded-2xl animate-pulse'></div>
            </div>

            {/* Video Details Grid Skeleton */}
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
              {/* Content Section Skeleton - 3 columns */}
              <div className='lg:col-span-3 space-y-8'>
                {/* Title and Categories Skeleton */}
                <div className='space-y-4'>
                  {/* Title Skeleton */}
                  <div className='space-y-2'>
                    <div className='w-3/4 h-8 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-1/2 h-8 bg-white/10 rounded animate-pulse'></div>
                  </div>

                  {/* Categories Pills Skeleton */}
                  <div className='flex flex-wrap gap-2'>
                    <div className='w-20 h-6 bg-white/10 rounded-full animate-pulse'></div>
                    <div className='w-24 h-6 bg-white/10 rounded-full animate-pulse'></div>
                    <div className='w-16 h-6 bg-white/10 rounded-full animate-pulse'></div>
                  </div>

                  {/* Metadata Skeleton */}
                  <div className='flex flex-wrap gap-4'>
                    <div className='w-24 h-5 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-16 h-5 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-20 h-5 bg-white/10 rounded animate-pulse'></div>
                  </div>

                  {/* Divider Skeleton */}
                  <div className='w-24 h-1 bg-white/10 rounded-full animate-pulse'></div>
                </div>

                {/* Description Card Skeleton */}
                <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
                  <div className='w-24 h-6 bg-white/10 rounded animate-pulse mb-4'></div>
                  <div className='space-y-2'>
                    <div className='w-full h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-full h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-3/4 h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-5/6 h-4 bg-white/10 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>

              {/* Sharing Section Skeleton - 1 column */}
              <div className='space-y-6'>
                {/* Video Stats Card Skeleton */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                  <div className='w-20 h-5 bg-white/10 rounded animate-pulse mb-4'></div>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <div className='w-12 h-4 bg-white/10 rounded animate-pulse'></div>
                      <div className='w-8 h-4 bg-white/10 rounded animate-pulse'></div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='w-10 h-4 bg-white/10 rounded animate-pulse'></div>
                      <div className='w-6 h-4 bg-white/10 rounded animate-pulse'></div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='w-14 h-4 bg-white/10 rounded animate-pulse'></div>
                      <div className='w-10 h-4 bg-white/10 rounded animate-pulse'></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className='space-y-3'>
                  <div className='w-full h-12 bg-white/10 rounded-xl animate-pulse'></div>
                  <div className='w-full h-12 bg-white/10 rounded-xl animate-pulse'></div>
                </div>

                {/* Details Card Skeleton */}
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                  <div className='w-16 h-5 bg-white/10 rounded animate-pulse mb-4'></div>
                  <div className='space-y-3'>
                    <div className='w-20 h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-full h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-16 h-4 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-12 h-4 bg-white/10 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>
            Video not found
          </h1>
          <Link
            href='/videos'
            className='text-blue-400 hover:text-blue-300'
          >
            ← Back to videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>

      {/* Navigation */}
      <div className='relative z-10 px-6 py-8'>
        <Link
          href='/videos'
          className='inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Back to Videos</span>
        </Link>

        {/* Main Content */}
        <div className='box'>
          {/* Video Player - Full Width */}
          <div className='mb-8'>
            <VideoPlayer
              src={video.video}
              title={video.title}
              thumbnail={video.thumbnail}
            />
          </div>

          {/* Video Details Grid - 3 columns for content + 1 for sharing */}
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            {/* Content Section - 3 columns */}
            <div className='lg:col-span-3 space-y-8'>
              {/* Video Title and Basic Info */}
              <div className='space-y-4'>
                <h1 className='text-3xl md:text-4xl font-bold text-white leading-tight'>
                  {video.title}
                </h1>

                {/* Categories Pills */}
                {video.categories && video.categories.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {video.categories.map((category, idx) => (
                      <Link
                        href={`/categories/${category.slug}`}
                        key={idx}
                        className='px-2 md:px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white/90 rounded-full text-xs md:text-sm border border-blue-500/30 hover:border-blue-400/50 transition-colors'
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className='flex flex-wrap items-center gap-4 text-white/70'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-sm'>
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Tag className='w-4 h-4' />
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        video.type === 'VLOG'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {video.type}
                    </span>
                  </div>

                  {video.isFeatured && (
                    <div className='flex items-center space-x-2'>
                      <Heart className='w-4 h-4 text-red-400' />
                      <span className='px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-300'>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
              </div>

              {/* Description */}
              {video.description && (
                <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
                  <h3 className='text-xl font-semibold text-white mb-4'>
                    Description
                  </h3>
                  <p className='text-white/80 leading-relaxed whitespace-pre-wrap'>
                    {video.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sharing Section - 1 column */}
            <div className='space-y-6'>
              {/* Action Buttons */}
              <div className='space-y-3'>
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2'>
                  <Heart className='w-4 h-4' />
                  <span>Like Video</span>
                </button>

                <button className='w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 border border-white/20'>
                  <Share2 className='w-4 h-4' />
                  <span>Share</span>
                </button>
              </div>

              {/* Additional Video Details */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Details
                </h3>

                <div className='space-y-3 text-sm'>
                  <div>
                    <span className='text-white/60'>Published:</span>
                    <p className='text-white mt-1'>
                      {new Date(video.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className='text-white/60'>Type:</span>
                    <p className='text-white mt-1'>{video.type}</p>
                  </div>

                  {video.isFeatured && (
                    <div>
                      <span className='text-white/60'>Status:</span>
                      <p className='text-red-300 mt-1'>Featured Content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
