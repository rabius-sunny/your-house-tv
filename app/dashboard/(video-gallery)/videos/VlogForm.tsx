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
import { Textarea } from '@/components/ui/textarea';
import { createVlogSchema } from '@/helper/schema/vlog';
import request from '@/services/http';
import { VlogCategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function VlogForm({
  categories,
  onSuccess
}: {
  categories: VlogCategory[];
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const [selectedVideo, setSelectedVideo] = useState<string>();

  const form = useForm({
    resolver: zodResolver(createVlogSchema),
    mode: 'onSubmit' as const,
    defaultValues: {
      title: '',
      description: '',
      isFeatured: false,
      type: 'VLOG' as const,
      categoryIds: []
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!thumbnail) {
        toast.error('Please select a thumbnail image');
        return;
      }

      if (!selectedVideo) {
        toast.error('Please upload a video');
        return;
      }

      // Submit form data
      const formData = {
        ...data,
        thumbnail,
        video: selectedVideo
      };

      const response = await request.post('/vlogs', formData);

      toast.success('Video created successfully!');

      // Reset form
      //   form.reset();
      //   setThumbnail(undefined);
      //   setSelectedVideo(undefined);

      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating vloVideog:', error);

      let errorMessage = 'Failed to create Video';

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create Video', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Create New Video</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Video Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter video title'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Video Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter video description'
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
              <p className='text-xs text-muted-foreground'>
                Recommended size: 1280x720px (16:9 aspect ratio)
              </p>
            </div>

            {/* Video Upload */}
            <div className='space-y-2'>
              <Label>Video</Label>
              <VideoUploader
                setIsLoading={setIsUploading}
                setSelectedVideo={setSelectedVideo}
              />
            </div>

            {/* Vlog Type */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Video type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='VLOG'>Vlog</SelectItem>
                      <SelectItem value='PODCAST'>Podcast</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories Selection */}
            <FormField
              control={form.control}
              name='categoryIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <div className='grid grid-cols-2 gap-4 p-4 border rounded-lg'>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={category.id}
                          checked={field.value?.includes(category.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, category.id]);
                            } else {
                              field.onChange(
                                currentValue.filter((id) => id !== category.id)
                              );
                            }
                          }}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={category.id}
                          className='text-sm font-normal cursor-pointer'
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {categories.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      No categories available. Create categories first.
                    </p>
                  )}
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
                      Featured Video
                    </FormLabel>
                    <div className='text-sm text-muted-foreground'>
                      Mark this video as featured to highlight it
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

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading || isUploading}
                className='flex-1'
              >
                {isLoading ? 'Creating...' : 'Create Video'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
