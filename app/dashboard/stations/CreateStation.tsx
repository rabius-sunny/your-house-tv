'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import MultipleVideoUploader from '@/components/shared/MultipleVideoUploader';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreateStation, createStationSchema } from '@/helper/schema/station';
import request from '@/services/http';
import { Channel, Station } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type StationFormProps = {
  channels: Channel[];
  onCreate: () => void;
  editStation?: Station | null;
};

export default function CreateStationComp({
  channels,
  onCreate,
  editStation = null
}: StationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const isEditMode = Boolean(editStation);

  // Helper function to add a new video
  const addVideo = (videoUrl: string) => {
    setUploadedVideos((prev) => [...prev, videoUrl]);
  };

  // Helper function to remove a video
  const removeVideo = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to reorder videos (PRESERVING DnD functionality)
  const reorderVideos = (reorderedVideos: string[]) => {
    setUploadedVideos(reorderedVideos);
  };

  const form = useForm<CreateStation>({
    resolver: zodResolver(createStationSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      startedAt: new Date(),
      endedAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      isFeatured: false,
      channelId: ''
    }
  });

  // Reset form when editStation changes
  useEffect(() => {
    if (editStation) {
      form.reset({
        name: editStation.name,
        startedAt: new Date(editStation.startedAt),
        endedAt: new Date(editStation.endedAt),
        isFeatured: editStation.isFeatured,
        channelId: editStation.channelId
      });
      setThumbnail(editStation.thumbnail);
      // PRESERVE existing videos with DnD ordering
      setUploadedVideos([...editStation.videos]);
    } else {
      form.reset({
        name: '',
        startedAt: new Date(),
        endedAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        isFeatured: false,
        channelId: ''
      });
      setThumbnail(undefined);
      setUploadedVideos([]);
    }
  }, [editStation, form]);

  const onSubmit = async (data: CreateStation) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!thumbnail) {
        toast.error('Please select a thumbnail image');
        return;
      }

      if (uploadedVideos.length === 0) {
        toast.error('Please upload at least one video');
        return;
      }

      // Submit form data with videos (PRESERVING video order from DnD)
      const formData = {
        ...data,
        thumbnail,
        videos: uploadedVideos // This maintains the DnD order
      };

      if (isEditMode && editStation) {
        // Update existing station
        const response = await request.put('/station', {
          slug: editStation.slug,
          ...formData
        });
        toast.success('Station updated successfully!');
      } else {
        // Create new station
        const response = await request.post('/station', formData);
        toast.success('Station created successfully!');
      }

      onCreate();

      // Reset form only if not in edit mode
      if (!isEditMode) {
        form.reset();
        setThumbnail(undefined);
        setUploadedVideos([]);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} station:`,
        error
      );

      let errorMessage = `Failed to ${
        isEditMode ? 'update' : 'create'
      } station`;

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} station`, {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FormContent = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 w-full'
      >
        {/* Station Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Station Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter station name'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail Upload */}
        <div className='space-y-2'>
          <Label>Thumbnail</Label>
          {isEditMode && thumbnail && (
            <div className='mb-2'>
              <p className='text-xs text-muted-foreground mb-1'>
                Current thumbnail:
              </p>
              <img
                src={thumbnail}
                alt='Current thumbnail'
                className='w-24 h-16 object-cover rounded border border-border/40'
              />
            </div>
          )}
          <ImageUploader
            setSelectedFile={setThumbnail}
            isLoading={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            Recommended size: 400x280px
            {isEditMode && ' • Upload a new image to replace the current one'}
          </p>
        </div>

        {/* Channel Selection */}
        <FormField
          control={form.control}
          name='channelId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a channel' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem
                      key={channel.id}
                      value={channel.id}
                    >
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name='startedAt'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date & Time</FormLabel>
              <FormControl>
                <Input
                  type='datetime-local'
                  {...field}
                  value={
                    field.value
                      ? new Date(
                          field.value.getTime() -
                            field.value.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name='endedAt'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date & Time</FormLabel>
              <FormControl>
                <Input
                  type='datetime-local'
                  {...field}
                  value={
                    field.value
                      ? new Date(
                          field.value.getTime() -
                            field.value.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Toggle */}
        <FormField
          control={form.control}
          name='isFeatured'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base cursor-pointer'>
                  Featured Station
                </FormLabel>
                <div className='text-sm text-muted-foreground'>
                  Mark this station as featured to highlight it
                </div>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Video Upload - PRESERVING DnD functionality */}
        <div className='space-y-4'>
          <Label>Videos</Label>
          {isEditMode && uploadedVideos.length > 0 && (
            <p className='text-xs text-muted-foreground'>
              Current videos ({uploadedVideos.length}): You can reorder, add new
              ones, or remove existing videos
            </p>
          )}
          <MultipleVideoUploader
            uploadedVideos={uploadedVideos}
            onVideoAdd={addVideo}
            onVideoRemove={removeVideo}
            onVideoReorder={reorderVideos} // PRESERVING DnD reorder functionality
            setIsUploading={setIsUploading}
            isLoading={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 pt-4'>
          <Button
            type='submit'
            disabled={isLoading || isUploading}
            className='flex-1'
          >
            {isLoading
              ? `${isEditMode ? 'Updating' : 'Creating'}...`
              : `${isEditMode ? 'Update' : 'Create'} Station`}
          </Button>
        </div>
      </form>
    </Form>
  );

  // Render in card mode (page layout)
  return (
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {isEditMode ? 'Edit Station' : 'Create New Station'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
