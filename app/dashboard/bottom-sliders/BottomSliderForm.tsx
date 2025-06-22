'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { CreateSlider, createSliderSchema } from '@/helper/schema/sliders';
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function BottomSliderForm({
  onCreate
}: {
  onCreate: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>();

  const form = useForm<CreateSlider>({
    resolver: zodResolver(createSliderSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      link: '',
      linktext: ''
    }
  });

  const onSubmit = async (data: CreateSlider) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!image) {
        toast.error('Please select a slider image');
        return;
      }

      // Submit form data with uploaded image URL and slider key
      const formData = {
        ...data,
        image,
        sliderKey: 'bottom_sliders'
      };

      const response = await request.post('/sliders', formData);
      onCreate();

      toast.success('Bottom slider created successfully!');

      form.reset();
      setImage(undefined);
    } catch (error: any) {
      console.error('Error creating bottom slider:', error);

      let errorMessage = 'Failed to create bottom slider';
      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create bottom slider', {
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
          Create New Bottom Slider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Slider Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slider Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter bottom slider title'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slider Subtitle */}
            <FormField
              control={form.control}
              name='subtitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slider Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter bottom slider subtitle'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slider Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter bottom slider description...'
                      className='min-h-[100px]'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slider Image Upload */}
            <div className='space-y-2'>
              <Label>Slider Image</Label>
              <ImageUploader
                setSelectedFile={setImage}
                isLoading={isLoading}
              />
              <p className='text-xs text-muted-foreground'>
                Recommended size: 1920x1080px (16:9 aspect ratio)
              </p>
            </div>

            {/* Link URL */}
            <FormField
              control={form.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter link URL (e.g., /videos, https://example.com)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link Text */}
            <FormField
              control={form.control}
              name='linktext'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter link text (e.g., Watch Now, Learn More)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1'
              >
                {isLoading ? 'Creating...' : 'Create Bottom Slider'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
