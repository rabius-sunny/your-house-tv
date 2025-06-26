'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { Sliders } from '@/types';
import { Edit, Eye, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import SliderDetailsDialog from './SliderDetailsDialog';
import SliderForm from './SliderForm';

type TProps = {
  sliders: Sliders;
  loading: boolean;
  onSliderDeleted: () => void;
  onSliderUpdated: () => void;
  sliderKey: 'hero_sliders' | 'bottom_sliders';
  title?: string;
};

export default function SliderList({
  sliders,
  loading,
  onSliderDeleted,
  onSliderUpdated,
  sliderKey = 'hero_sliders',
  title = 'Hero Sliders'
}: TProps) {
  const [selectedSlider, setSelectedSlider] = useState<Sliders[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editSlider, setEditSlider] = useState<Sliders[0] | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleDelete = async (slider: Sliders[0]) => {
    if (
      !confirm(
        `Are you sure you want to delete the ${title
          .toLowerCase()
          .slice(0, -1)} "${slider.title}"?`
      )
    ) {
      return;
    }

    try {
      setDeletingKey(slider.key);
      const deleteUrl = `/sliders?key=${slider.key}&sliderKey=${sliderKey}`;
      await request.delete(deleteUrl);
      toast.success(`${title.slice(0, -1)} deleted successfully`);
      onSliderDeleted();
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error(`Failed to delete ${title.toLowerCase().slice(0, -1)}`);
    } finally {
      setDeletingKey(null);
    }
  };

  const handleViewDetails = (slider: Sliders[0]) => {
    setSelectedSlider(slider);
    setIsDialogOpen(true);
  };

  const handleEdit = (slider: Sliders[0]) => {
    setEditSlider(slider);
    setEditDialogOpen(true);
  };

  const handleSliderUpdated = () => {
    onSliderUpdated();
    setEditDialogOpen(false);
    setEditSlider(null);
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='grid gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <Skeleton className='h-20 w-32 rounded-lg' />
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

  if (!sliders || sliders.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>
                No {title.toLowerCase()} found
              </h3>
              <p className='text-muted-foreground'>
                Create your first {title.toLowerCase().slice(0, -1)} to get
                started.
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
            {sliders.map((slider) => (
              <Card
                key={slider.key}
                className='overflow-hidden'
              >
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    {/* Slider Image */}
                    <div className='relative h-32 w-full rounded-lg overflow-hidden bg-muted'>
                      <Image
                        src={slider.image}
                        alt={slider.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, 300px'
                      />
                    </div>

                    {/* Slider Info */}
                    <div className='space-y-2'>
                      <h3 className='font-semibold text-lg line-clamp-1'>
                        {slider.title}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {slider.subtitle}
                      </p>
                      <p className='text-xs text-muted-foreground line-clamp-2'>
                        {slider.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 pt-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleViewDetails(slider)}
                        className='flex-1'
                      >
                        <Eye className='h-4 w-4 mr-1' />
                        View
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1'
                        onClick={() => handleEdit(slider)}
                      >
                        <Edit className='h-4 w-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(slider)}
                        disabled={deletingKey === slider.key}
                      >
                        {deletingKey === slider.key ? (
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
              <CardTitle>
                {title} ({sliders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <div className='min-w-[800px]'>
                  {/* Table Header */}
                  <div className='grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-t-lg border-b font-medium text-sm'>
                    <div className='col-span-3'>Image & Title</div>
                    <div className='col-span-3'>Subtitle</div>
                    <div className='col-span-4'>Description</div>
                    <div className='col-span-2 text-center'>Actions</div>
                  </div>

                  {/* Table Body */}
                  <div className='space-y-0'>
                    {sliders.map((slider, index) => (
                      <div
                        key={slider.key}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                        }`}
                      >
                        {/* Image & Title */}
                        <div className='col-span-3 flex items-center gap-3'>
                          <div className='relative h-12 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                            <Image
                              src={slider.image}
                              alt={slider.title}
                              fill
                              className='object-cover'
                              sizes='64px'
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <h3 className='font-medium text-sm line-clamp-1'>
                              {slider.title}
                            </h3>
                            <p className='text-xs text-muted-foreground line-clamp-1'>
                              {slider.linktext}
                            </p>
                          </div>
                        </div>

                        {/* Subtitle */}
                        <div className='col-span-3 flex items-center'>
                          <p className='text-sm line-clamp-1'>
                            {slider.subtitle}
                          </p>
                        </div>

                        {/* Description */}
                        <div className='col-span-4 flex items-center'>
                          <p className='text-xs text-muted-foreground line-clamp-1'>
                            {slider.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className='col-span-2 flex items-center justify-center gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleViewDetails(slider)}
                            className='h-8 w-8 p-0'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-8 w-8 p-0'
                            onClick={() => handleEdit(slider)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleDelete(slider)}
                            disabled={deletingKey === slider.key}
                            className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                          >
                            {deletingKey === slider.key ? (
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
      <SliderDetailsDialog
        slider={selectedSlider}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedSlider(null);
        }}
        title={title.slice(0, -1)}
      />

      {/* Edit Slider Dialog */}
      <SliderForm
        editSlider={editSlider}
        isDialogMode={true}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCreate={handleSliderUpdated}
        sliderKey={sliderKey}
        title={title.slice(0, -1)}
      />
    </>
  );
}
