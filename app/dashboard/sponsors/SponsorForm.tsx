'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateSponsor, createSponsorSchema } from '@/helper/schema/sponsor';
import request from '@/services/http';
import { Sponsor, Station } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SponsorFormProps = {
  stations: Station[];
  sponsor?: Sponsor | null;
  onCreate?: () => void;
  onUpdate?: () => void;
  onCancel?: () => void;
};

export default function SponsorForm({
  stations,
  sponsor = null,
  onCreate,
  onUpdate,
  onCancel
}: SponsorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>(
    sponsor?.thumbnail || ''
  );

  const isEditing = !!sponsor;

  const form = useForm<CreateSponsor>({
    resolver: zodResolver(createSponsorSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: sponsor?.name || '',
      designation: sponsor?.designation || '',
      website: sponsor?.website || '',
      stationIds: sponsor?.stationIds || []
    }
  });

  // Update thumbnail and form when sponsor changes
  useEffect(() => {
    if (sponsor) {
      setSelectedThumbnail(sponsor.thumbnail || '');
      form.reset({
        name: sponsor.name,
        designation: sponsor.designation || '',
        website: sponsor.website || '',
        stationIds: sponsor.stationIds || []
      });
    }
  }, [sponsor, form]);

  const onSubmit = async (data: CreateSponsor) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!selectedThumbnail) {
        toast.error('Please select a sponsor thumbnail');
        return;
      }

      // Submit form data with uploaded thumbnail URL
      const formData = {
        ...data,
        thumbnail: selectedThumbnail,
        ...(isEditing && { id: sponsor!.id })
      };

      if (isEditing) {
        await request.put('/sponsors', formData);
        onUpdate?.();
        toast.success('Sponsor updated successfully!');
      } else {
        await request.post('/sponsors', formData);
        onCreate?.();
        toast.success('Sponsor created successfully!');
      }

      if (!isEditing) {
        form.reset();
        setSelectedThumbnail('');
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? 'updating' : 'creating'} sponsor:`,
        error
      );

      let errorMessage = `Failed to ${isEditing ? 'update' : 'create'} sponsor`;
      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditing ? 'update' : 'create'} sponsor`, {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {isEditing ? 'Edit Sponsor' : 'Create New Sponsor'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Sponsor Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter sponsor name (e.g., Tech Corp)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sponsor Designation */}
            <FormField
              control={form.control}
              name='designation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter designation (e.g., Gold Sponsor, Main Partner)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website URL */}
            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter website URL (e.g., https://example.com)'
                      {...field}
                      disabled={isLoading}
                      type='url'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Station Selection */}
            <FormField
              control={form.control}
              name='stationIds'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-base'>Stations</FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      Select stations that this sponsor is associated with
                    </p>
                  </div>
                  <div className='border rounded-md p-2 max-h-40 overflow-y-auto bg-background'>
                    <div className='space-y-1'>
                      {stations.map((station) => (
                        <FormField
                          key={station.id}
                          control={form.control}
                          name='stationIds'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={station.id}
                                className='flex flex-row items-center space-x-2 space-y-0 py-0.5 px-1 hover:bg-muted/50 rounded-sm'
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(station.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            station.id
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== station.id
                                            )
                                          );
                                    }}
                                    disabled={isLoading}
                                    className='h-4 w-4'
                                  />
                                </FormControl>
                                <FormLabel className='text-sm font-normal cursor-pointer flex-1 leading-4'>
                                  {station.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload */}
            <div className='space-y-2'>
              <Label>Sponsor Thumbnail</Label>
              <ImageUploader
                setSelectedFile={setSelectedThumbnail}
                isLoading={isLoading}
              />
              <p className='text-xs text-muted-foreground'>
                Recommended size: 200x200px (1:1 aspect ratio)
              </p>
              {isEditing && selectedThumbnail && (
                <div className='mt-2'>
                  <p className='text-xs text-muted-foreground mb-2'>
                    Current thumbnail:
                  </p>
                  <div className='relative h-20 w-20 rounded-lg overflow-hidden bg-muted'>
                    <img
                      src={selectedThumbnail}
                      alt='Current thumbnail'
                      className='object-cover w-full h-full'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              {isEditing && onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  disabled={isLoading}
                  className='flex-1'
                >
                  Cancel
                </Button>
              )}
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1'
              >
                {isLoading
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Sponsor'
                  : 'Create Sponsor'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
