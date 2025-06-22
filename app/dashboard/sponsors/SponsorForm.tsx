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
import { CreateSponsor, createSponsorSchema } from '@/helper/schema/sponsor';
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SponsorFormProps = {
  onCreate: () => void;
};

export default function SponsorForm({ onCreate }: SponsorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<string>();

  const form = useForm<CreateSponsor>({
    resolver: zodResolver(createSponsorSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      designation: '',
      url: ''
    }
  });

  const onSubmit = async (data: CreateSponsor) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!logo) {
        toast.error('Please select a sponsor logo');
        return;
      }

      // Submit form data with uploaded logo URL
      const formData = {
        ...data,
        logo
      };

      const response = await request.post('/sponsors', formData);
      onCreate();

      toast.success('Sponsor created successfully!');

      form.reset();
      setLogo(undefined);
    } catch (error: any) {
      console.error('Error creating sponsor:', error);

      let errorMessage = 'Failed to create sponsor';
      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create sponsor', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Create New Sponsor</CardTitle>
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
              name='url'
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

            {/* Logo Upload */}
            <div className='space-y-2'>
              <Label>Sponsor Logo</Label>
              <ImageUploader
                setSelectedFile={setLogo}
                isLoading={isLoading}
              />
              <p className='text-xs text-muted-foreground'>
                Recommended size: 200x200px (1:1 aspect ratio)
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1'
              >
                {isLoading ? 'Creating...' : 'Create Sponsor'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
