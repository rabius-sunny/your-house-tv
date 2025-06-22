'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Sponsor } from '@/types';
import { Edit, Eye, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import SponsorDetailsDialog from './SponsorDetailsDialog';
import SponsorEditForm from './SponsorEditForm';

type TProps = {
  sponsors: Sponsor[];
  loading: boolean;
  onSponsorDeleted: () => void;
  onSponsorUpdated: () => void;
};

export default function SponsorList({
  sponsors,
  loading,
  onSponsorDeleted,
  onSponsorUpdated
}: TProps) {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (sponsor: Sponsor) => {
    if (
      !confirm(`Are you sure you want to delete the sponsor "${sponsor.name}"?`)
    ) {
      return;
    }

    try {
      setDeletingId(sponsor.id);
      await request.delete(`/sponsors/${sponsor.id}`);
      toast.success('Sponsor deleted successfully');
      onSponsorDeleted();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Failed to delete sponsor');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsDialogOpen(true);
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
  };

  const handleEditCancel = () => {
    setEditingSponsor(null);
  };

  const handleEditComplete = () => {
    setEditingSponsor(null);
    onSponsorUpdated();
  };

  // Show edit form if editing
  if (editingSponsor) {
    return (
      <SponsorEditForm
        sponsor={editingSponsor}
        onUpdate={handleEditComplete}
        onCancel={handleEditCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='grid gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <Skeleton className='h-20 w-20 rounded-lg' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                    <Skeleton className='h-4 w-full' />
                  </div>
                  <div className='flex gap-2'>
                    <Skeleton className='h-8 w-8 rounded' />
                    <Skeleton className='h-8 w-8 rounded' />
                    <Skeleton className='h-8 w-8 rounded' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!sponsors || sponsors.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>No sponsors found</h3>
              <p className='text-muted-foreground'>
                Create your first sponsor to get started.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        {/* Mobile View */}
        <div className='block md:hidden'>
          <div className='grid gap-4'>
            {sponsors.map((sponsor) => (
              <Card
                key={sponsor.id}
                className='overflow-hidden'
              >
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    {/* Sponsor Logo */}
                    <div className='relative h-20 w-20 rounded-lg overflow-hidden bg-muted mx-auto'>
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        className='object-cover'
                        sizes='80px'
                      />
                    </div>

                    {/* Sponsor Info */}
                    <div className='space-y-2 text-center'>
                      <h3 className='font-semibold text-lg line-clamp-1'>
                        {sponsor.name}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {sponsor.designation}
                      </p>
                      <p className='text-xs text-muted-foreground line-clamp-1'>
                        {sponsor.url}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 pt-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleViewDetails(sponsor)}
                        className='flex-1'
                      >
                        <Eye className='h-4 w-4 mr-1' />
                        View
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(sponsor)}
                        className='flex-1'
                      >
                        <Edit className='h-4 w-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(sponsor)}
                        disabled={deletingId === sponsor.id}
                      >
                        {deletingId === sponsor.id ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash2 className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className='hidden md:block'>
          <Card>
            <CardHeader>
              <CardTitle>Sponsors ({sponsors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <div className='min-w-[800px]'>
                  {/* Table Header */}
                  <div className='grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-t-lg border-b font-medium text-sm'>
                    <div className='col-span-3'>Logo & Name</div>
                    <div className='col-span-3'>Designation</div>
                    <div className='col-span-4'>Website URL</div>
                    <div className='col-span-2 text-center'>Actions</div>
                  </div>

                  {/* Table Body */}
                  <div className='space-y-0'>
                    {sponsors.map((sponsor, index) => (
                      <div
                        key={sponsor.id}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                        }`}
                      >
                        {/* Logo & Name */}
                        <div className='col-span-3 flex items-center gap-3'>
                          <div className='relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                            <Image
                              src={sponsor.logo}
                              alt={sponsor.name}
                              fill
                              className='object-cover'
                              sizes='48px'
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <h3 className='font-medium text-sm line-clamp-1'>
                              {sponsor.name}
                            </h3>
                          </div>
                        </div>

                        {/* Designation */}
                        <div className='col-span-3 flex items-center'>
                          <p className='text-sm line-clamp-1'>
                            {sponsor.designation}
                          </p>
                        </div>

                        {/* Website URL */}
                        <div className='col-span-4 flex items-center'>
                          <a
                            href={sponsor.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs text-primary hover:underline line-clamp-1'
                          >
                            {sponsor.url}
                          </a>
                        </div>

                        {/* Actions */}
                        <div className='col-span-2 flex items-center justify-center gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleViewDetails(sponsor)}
                            className='h-8 w-8 p-0'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleEdit(sponsor)}
                            className='h-8 w-8 p-0'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleDelete(sponsor)}
                            disabled={deletingId === sponsor.id}
                            className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                          >
                            {deletingId === sponsor.id ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                              <Trash2 className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Dialog */}
      <SponsorDetailsDialog
        sponsor={selectedSponsor}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedSponsor(null);
        }}
      />
    </>
  );
}
