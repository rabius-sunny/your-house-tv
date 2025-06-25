'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Channel, Station } from '@/types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import StationDetailsDialog from './StationDetailsDialog';

type StationListProps = {
  stations: Station[];
  channels: Channel[];
  loading: boolean;
  onStationDeleted: () => void;
  onStationUpdated: () => void;
};

export default function StationList({
  stations,
  channels,
  loading,
  onStationDeleted,
  onStationUpdated
}: StationListProps) {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (station: Station) => {
    if (!confirm('Are you sure you want to delete this station?')) {
      return;
    }

    try {
      setDeletingId(station.id);
      await request.delete(`/station?id=${station.id}`);
      toast.success('Station deleted successfully');
      onStationDeleted();
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error('Failed to delete station');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (station: Station) => {
    setSelectedStation(station);
    setIsDetailsOpen(true);
  };

  const handleEdit = (station: Station) => {
    router.push(`/dashboard/stations/${station.slug}/edit`);
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

  const formatDateRange = (startedAt: Date, endedAt: Date) => {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const startStr = start.toLocaleDateString();
    const endStr = end.toLocaleDateString();

    if (startStr === endStr) {
      return `${startStr} (${start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })} - ${end.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })})`;
    }
    return `${startStr} - ${endStr}`;
  };

  // Loading Skeleton Component
  const StationTableSkeleton = () => (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-5 w-32' />
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px]'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='p-4 text-left w-12 min-w-[50px]'>
                  <Skeleton className='h-4 w-8' />
                </th>
                <th className='p-4 text-left min-w-[200px]'>
                  <Skeleton className='h-4 w-20' />
                </th>
                <th className='p-4 text-left w-28 min-w-[100px]'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left w-20 min-w-[70px]'>
                  <Skeleton className='h-4 w-12' />
                </th>
                <th className='p-4 text-left w-24 min-w-[90px]'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left w-36 min-w-[140px]'>
                  <Skeleton className='h-4 w-20' />
                </th>
                <th className='p-4 text-left w-28 min-w-[100px]'>
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
                      <Skeleton className='h-12 w-16 rounded flex-shrink-0' />
                      <div className='space-y-2 flex-1 min-w-0'>
                        <Skeleton className='h-4 w-24' />
                      </div>
                    </div>
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-20' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-16' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-5 w-16' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-24' />
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-8 flex-shrink-0' />
                      <Skeleton className='h-8 w-8 flex-shrink-0' />
                      <Skeleton className='h-8 w-8 flex-shrink-0' />
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
    return <StationTableSkeleton />;
  }

  if (!stations.length) {
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
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No stations found</h3>
            <p className='text-muted-foreground'>
              Create your first station to start broadcasting content.
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
            <CardTitle className='text-xl font-bold'>Stations</CardTitle>
            <p className='text-sm text-muted-foreground'>
              {stations.length} station{stations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[700px]'>
              <thead className='bg-muted/50 border-b border-border/40'>
                <tr>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-12 min-w-[50px]'>
                    #
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground min-w-[200px]'>
                    Station
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-28 min-w-[100px]'>
                    Channel
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-20 min-w-[70px]'>
                    Videos
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-24 min-w-[90px]'>
                    Status
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-36 min-w-[140px]'>
                    Schedule
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground w-28 min-w-[100px]'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {stations.map((station, index) => (
                  <tr
                    key={station.id}
                    className='hover:bg-muted/30 transition-colors duration-200 group'
                  >
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground font-mono whitespace-nowrap'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='relative flex-shrink-0'>
                          <img
                            src={station.thumbnail || '/placeholder.jpg'}
                            alt={station.name}
                            className='w-16 h-12 object-cover rounded border border-border/40'
                            loading='lazy'
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg';
                            }}
                          />
                          {station.isFeatured && (
                            <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-background' />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-foreground truncate'>
                              {station.name}
                            </span>
                            {station.isFeatured && (
                              <Badge
                                variant='secondary'
                                className='text-xs animate-pulse flex-shrink-0'
                              >
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            {formatDate(station.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground whitespace-nowrap'>
                        {station.channel?.name || 'No Channel'}
                      </span>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground whitespace-nowrap'>
                        {station.videos?.length || 0}
                      </span>
                    </td>
                    <td className='p-4'>
                      <Badge
                        variant={station.isFeatured ? 'default' : 'outline'}
                        className='text-xs whitespace-nowrap'
                      >
                        {station.isFeatured ? 'Featured' : 'Regular'}
                      </Badge>
                    </td>
                    <td className='p-4'>
                      <span className='text-xs text-muted-foreground whitespace-nowrap'>
                        {formatDateRange(station.startedAt, station.endedAt)}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary flex-shrink-0'
                          title='View details'
                          onClick={() => handleViewDetails(station)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600 flex-shrink-0'
                          title='Edit station'
                          onClick={() => handleEdit(station)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(station)}
                          disabled={deletingId === station.id}
                          className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 flex-shrink-0'
                          title='Delete station'
                        >
                          {deletingId === station.id ? (
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

      {/* Station Details Dialog */}
      <StationDetailsDialog
        station={selectedStation}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
