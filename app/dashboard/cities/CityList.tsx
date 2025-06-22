'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { City } from '@/types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CityDetailsDialog from './CityDetailsDialog';

type TProps = {
  cities: City[];
  loading: boolean;
  onCityDeleted: () => void;
};

export default function CityList({ cities, loading, onCityDeleted }: TProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (city: City) => {
    setSelectedCity(city);
    setDialogOpen(true);
  };

  const handleDelete = async (cityId: string) => {
    if (!confirm('Are you sure you want to delete this city?')) {
      return;
    }

    try {
      setDeletingId(cityId);
      await request.delete(`/city?id=${cityId}`);
      toast.success('City deleted successfully!');
      onCityDeleted();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading Skeleton Component
  const CityTableSkeleton = () => (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-5 w-32' />
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-12' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-20' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className='border-b border-border/40'
                >
                  <td className='p-4'>
                    <Skeleton className='h-4 w-8' />
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-12 w-16 rounded' />
                    </div>
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-24' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-20' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-5 w-16' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-24' />
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Show loading skeleton while loading
  if (loading) {
    return <CityTableSkeleton />;
  }

  if (cities.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <div className='text-center max-w-md'>
            <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No cities found</h3>
            <p className='text-muted-foreground'>
              Create your first city to organize content by geographic location.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold'>Cities</CardTitle>
            <p className='text-sm text-muted-foreground'>
              {cities.length} cit{cities.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-muted/50 border-b border-border/40'>
                <tr>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    #
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Thumbnail
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Name
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Network
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Status
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Created
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {cities.map((city, index) => (
                  <tr
                    key={city.id}
                    className='hover:bg-muted/30 transition-colors duration-200 group'
                  >
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground font-mono'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <img
                            src={city.thumbnail}
                            alt={city.name}
                            className='w-16 h-12 object-cover rounded border border-border/40'
                            loading='lazy'
                          />
                          {city.isFeatured && (
                            <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-background' />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>
                          {city.name}
                        </span>
                      </div>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground'>
                        {city.network?.name || 'No Network'}
                      </span>
                    </td>
                    <td className='p-4'>
                      <Badge
                        variant={city.isFeatured ? 'default' : 'outline'}
                        className='text-xs'
                      >
                        {city.isFeatured ? 'Featured' : 'Regular'}
                      </Badge>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(city.createdAt)}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary'
                          title='View details'
                          onClick={() => handleViewDetails(city)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600'
                          title='Edit city'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(city.id)}
                          disabled={deletingId === city.id}
                          className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50'
                          title='Delete city'
                        >
                          {deletingId === city.id ? (
                            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* City Details Dialog */}
      <CityDetailsDialog
        city={selectedCity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
