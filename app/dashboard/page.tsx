'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsync } from '@/hooks/useAsync';
import { DashboardStats } from '@/types';
import {
  BookOpen,
  Building2,
  ChevronRight,
  FileStack,
  FileVideo2,
  FolderOpen,
  Globe,
  LucideIcon,
  RadioTower,
  TvMinimalPlay,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface StatItem {
  title: string;
  value: number;
  icon: LucideIcon;
  link: string;
  color: string;
  bgColor: string;
  description?: string;
}

export default function Page() {
  const { data: stats, loading, error } = useAsync<DashboardStats>('/stats');

  useEffect(() => {
    if (error) {
      toast.error('Failed to load dashboard statistics');
    }
  }, [error]);

  useEffect(() => {
    if (stats) {
      console.log('Dashboard received stats:', stats);
    }
  }, [stats]);

  useEffect(() => {
    if (stats) {
      console.log('Dashboard received stats:', stats);
    }
  }, [stats]);

  if (loading) {
    return (
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className='animate-pulse'
            >
              <CardHeader className='pb-2'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              </CardHeader>
              <CardContent>
                <div className='h-8 bg-gray-200 rounded w-1/2'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || error) {
    return (
      <div className='p-6'>
        <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
        <div className='text-center py-8'>
          <p className='text-gray-500'>Failed to load dashboard statistics</p>
        </div>
      </div>
    );
  }

  const primaryStats: StatItem[] = [
    {
      title: 'Networks',
      value: stats.networks,
      icon: Globe,
      link: '/dashboard/networks',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cities',
      value: stats.cities,
      icon: Building2,
      link: '/dashboard/cities',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Channels',
      value: stats.channels,
      icon: TvMinimalPlay,
      link: '/dashboard/channels',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Stations',
      value: stats.stations,
      icon: RadioTower,
      link: '/dashboard/stations',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const contentStats: StatItem[] = [
    {
      title: 'Videos',
      value: stats.vlogs,
      icon: FileVideo2,
      link: '/dashboard/videos',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Video Categories',
      value: stats.vlogCategories,
      icon: FileStack,
      link: '/dashboard/categories',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const StatCard = ({
    stat,
    showLink = true
  }: {
    stat: any;
    showLink?: boolean;
  }) => {
    const CardWrapper = (
      <Card className='hover:shadow-lg transition-shadow duration-200 cursor-pointer group'>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-4xl font-bold'>
                {stat.value.toLocaleString()}
              </div>
              {stat.description && (
                <p className='text-xs text-gray-500 mt-1'>{stat.description}</p>
              )}
            </div>
            {showLink && stat.link !== '#' && (
              <ChevronRight className='h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors' />
            )}
          </div>
        </CardContent>
      </Card>
    );

    if (showLink && stat.link !== '#') {
      return <Link href={stat.link}>{CardWrapper}</Link>;
    }

    return CardWrapper;
  };

  return (
    <div className='p-6'>
      {/* Primary Stats - Broadcast Infrastructure */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Broadcast Infrastructure
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {primaryStats.map((stat) => (
            <StatCard
              key={stat.title}
              stat={stat}
            />
          ))}
        </div>
      </div>

      {/* Content Stats */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Content & Media
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {contentStats.map((stat) => (
            <StatCard
              key={stat.title}
              stat={stat}
            />
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          System Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Users Card */}
          <Card className='hover:shadow-lg transition-shadow duration-200'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Users
                </CardTitle>
                <div className='p-2 rounded-full bg-blue-50'>
                  <Users className='h-4 w-4 text-blue-600' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold text-blue-700'>
                {stats.users.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Registered users</p>
            </CardContent>
          </Card>

          {/* Blog Categories Card */}
          <Card className='hover:shadow-lg transition-shadow duration-200'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Blog Categories
                </CardTitle>
                <div className='p-2 rounded-full bg-purple-50'>
                  <FolderOpen className='h-4 w-4 text-purple-600' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold text-purple-700'>
                {stats.blogCategories.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Blog categories</p>
            </CardContent>
          </Card>

          {/* Blog Posts Card */}
          <Card className='hover:shadow-lg transition-shadow duration-200'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Blog Posts
                </CardTitle>
                <div className='p-2 rounded-full bg-emerald-50'>
                  <BookOpen className='h-4 w-4 text-emerald-600' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold text-emerald-700'>
                {stats.blogs.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Published articles</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
