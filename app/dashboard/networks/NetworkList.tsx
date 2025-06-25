'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Network } from '@/types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import NetworkComp from './CreateNetwork';
import NetworkDetailsDialog from './NetworkDetailsDialog';

type TProps = {
  networks: Network[];
  loading: boolean;
  onNetworkDeleted: () => void;
  onNetworkUpdated: () => void;
};

export default function NetworkList({
  networks,
  loading,
  onNetworkDeleted,
  onNetworkUpdated
}: TProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNetwork, setEditNetwork] = useState<Network | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleViewDetails = (network: Network) => {
    setSelectedNetwork(network);
    setDialogOpen(true);
  };

  const handleEdit = (network: Network) => {
    setEditNetwork(network);
    setEditDialogOpen(true);
  };

  const handleNetworkUpdated = () => {
    onNetworkUpdated();
    setEditDialogOpen(false);
    setEditNetwork(null);
  };

  const handleDelete = async (network: Network) => {
    if (!confirm('Are you sure you want to delete this network?')) {
      return;
    }

    try {
      setDeletingId(network.id);
      await request.delete(`/network?slug=${network.slug}`);
      toast.success('Network deleted successfully!');
      onNetworkDeleted();
    } catch (error: any) {
      console.error('Error deleting network:', error);
      toast.error(error?.response?.data?.error || 'Failed to delete network');
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
  const NetworkTableSkeleton = () => (
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
                      <Skeleton className='h-4 w-24' />
                    </div>
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-32' />
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
    return <NetworkTableSkeleton />;
  }

  if (networks.length === 0) {
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
                  d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No networks found</h3>
            <p className='text-muted-foreground'>
              Create your first network to organize your content by broadcasting
              channels.
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
            <CardTitle className='text-xl font-bold'>Networks</CardTitle>
            <p className='text-sm text-muted-foreground'>
              {networks.length} network{networks.length !== 1 ? 's' : ''}
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
                    Network
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Name
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
                {networks.map((network, index) => (
                  <tr
                    key={network.id}
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
                            src={network.thumbnail}
                            alt={network.name}
                            className='w-16 h-12 object-cover rounded border border-border/40'
                            loading='lazy'
                          />
                          {network.isFeatured && (
                            <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-background' />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>
                          {network.name}
                        </span>
                      </div>
                    </td>
                    <td className='p-4'>
                      <Badge
                        variant={network.isFeatured ? 'default' : 'outline'}
                        className='text-xs'
                      >
                        {network.isFeatured ? 'Featured' : 'Regular'}
                      </Badge>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(network.createdAt)}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary'
                          title='View details'
                          onClick={() => handleViewDetails(network)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600'
                          title='Edit network'
                          onClick={() => handleEdit(network)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(network)}
                          disabled={deletingId === network.id}
                          className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50'
                          title='Delete network'
                        >
                          {deletingId === network.id ? (
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

      {/* Network Details Dialog */}
      <NetworkDetailsDialog
        network={selectedNetwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Edit Network Dialog */}
      <NetworkComp
        onCreate={handleNetworkUpdated}
        editNetwork={editNetwork}
        isDialogMode={true}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
