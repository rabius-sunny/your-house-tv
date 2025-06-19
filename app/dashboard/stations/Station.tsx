'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import VideoUploader from '@/components/shared/VideoUploader';
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
import { Channel } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function StationComp({ channels }: { channels: Channel[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const [selectedVideo, setSelectedVideo] = useState<string>();

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

  const onSubmit = async (data: CreateStation) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!thumbnail) {
        toast.error('Please select a thumbnail image');
        return;
      }

      // Submit form data with videos
      const formData = {
        ...data,
        thumbnail,
        videos: [selectedVideo]
      };

      const response = await request.post('/station', formData);

      toast.success('Station created successfully!');

      form.reset();
      setThumbnail(undefined);
    } catch (error: any) {
      console.error('Error creating station:', error);

      let errorMessage = 'Failed to create station';

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create station', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Create New Station</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
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
              <ImageUploader
                setSelectedFile={setThumbnail}
                isLoading={isLoading}
              />
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
                    defaultValue={field.value}
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

            {/* Video Upload */}
            <div className='space-y-2'>
              <Label>Video</Label>
              <VideoUploader
                setIsLoading={setIsUploading}
                setSelectedVideo={setSelectedVideo}
              />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading || isUploading}
                className='flex-1'
              >
                {isLoading ? 'Creating...' : 'Create Station'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
