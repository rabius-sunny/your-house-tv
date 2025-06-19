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
import { CreateNetwork, createNetworkSchema } from '@/helper/schema/network';
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NetworkComp() {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();

  const form = useForm<CreateNetwork>({
    resolver: zodResolver(createNetworkSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      // thumbnail: '',
      isFeatured: false
    }
  });

  const onSubmit = async (data: CreateNetwork) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!thumbnail) {
        toast.error('Please select a thumbnail image');
        return;
      }

      // Submit form data with uploaded thumbnail URL
      const formData = {
        ...data,
        thumbnail
      };

      const response = await request.post('/network', formData);

      toast.success('Network created successfully!');

      form.reset();
      setThumbnail(undefined);
    } catch (error: any) {
      console.error('Error creating network:', error);

      let errorMessage = 'Failed to create network';

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create network', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Create New Network</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Network Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter network name (e.g., HBO, Netflix)'
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
                Recommended size: 400x280px
              </p>
            </div>

            {/* Featured Toggle */}
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base cursor-pointer'>
                      Featured Network
                    </FormLabel>
                    <div className='text-sm text-muted-foreground'>
                      Mark this network as featured to highlight it
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
                disabled={isLoading}
                className='flex-1'
              >
                {isLoading ? 'Creating...' : 'Create Network'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
