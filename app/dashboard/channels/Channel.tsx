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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateChannel, createChannelSchema } from '@/helper/schema';
import request from '@/services/http';
import { City } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TProps = {
  cities: City[];
};

export default function ChannelComp({ cities: networks }: TProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();

  const form = useForm<CreateChannel>({
    resolver: zodResolver(createChannelSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      isFeatured: false,
      cityId: ''
    }
  });

  const onSubmit = async (data: CreateChannel) => {
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

      const response = await request.post('/channel', formData);

      toast.success('Channel created successfully!');

      form.reset();
      setThumbnail(undefined);
    } catch (error: any) {
      console.error('Error creating channel:', error);

      let errorMessage = 'Failed to create channel';

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create channel', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Create New Channel</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Channel Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter channel name (e.g., HBO, Netflix)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Channel Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter channel description'
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

            {/* Network Selection */}
            <FormField
              control={form.control}
              name='cityId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a city' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {networks.map((network) => (
                        <SelectItem
                          key={network.id}
                          value={network.id}
                        >
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      Featured Channel
                    </FormLabel>
                    <div className='text-sm text-muted-foreground'>
                      Mark this channel as featured to highlight it
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
                {isLoading ? 'Creating...' : 'Create Channel'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
