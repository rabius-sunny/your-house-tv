'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateNetwork, createNetworkSchema } from '@/helper/schema/network';
import request from '@/services/http';

export default function NetworkComp() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateNetwork>({
    resolver: zodResolver(createNetworkSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      thumbnail: '',
      isFeatured: false
    }
  });

  const onSubmit = async (data: CreateNetwork) => {
    try {
      setIsLoading(true);

      const response = await request.post('/network', data);

      toast.success('Network created successfully!');

      form.reset();
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

            {/* Thumbnail URL */}
            <FormField
              control={form.control}
              name='thumbnail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://example.com/network-logo.jpg'
                      {...field}
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
