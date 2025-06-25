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
import { Sponsor } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SponsorEditFormProps = {
  sponsor: Sponsor;
  onUpdate: () => void;
  onCancel: () => void;
};

export default function SponsorEditForm({
  sponsor,
  onUpdate,
  onCancel
}: SponsorEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<string>(sponsor.logo);

  const form = useForm<CreateSponsor>({
    resolver: zodResolver(createSponsorSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: sponsor.name,
      designation: sponsor.designation,
      url: sponsor.url
    }
  });

  // Update logo state when sponsor changes
  useEffect(() => {
    setLogo(sponsor.logo);
  }, [sponsor.logo]);

  const onSubmit = async (data: CreateSponsor) => {
    try {
      setIsLoading(true);

      if (!logo) {
        toast.error('Please select a sponsor logo');
        return;
      }

      // Submit form data with uploaded logo URL
      const formData = {
        id: sponsor.id,
        ...data,
        logo
      };

      await request.put('/sponsors', formData);
      onUpdate();

      toast.success('Sponsor updated successfully!');
    } catch (error: any) {
      console.error('Error updating sponsor:', error);

      let errorMessage = 'Failed to update sponsor';
      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to update sponsor', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Edit Sponsor</CardTitle>
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
              {logo && (
                <div className='mt-2'>
                  <p className='text-xs text-muted-foreground mb-2'>
                    Current logo:
                  </p>
                  <div className='relative h-20 w-20 rounded-lg overflow-hidden bg-muted'>
                    <img
                      src={logo}
                      alt='Current logo'
                      className='object-cover w-full h-full'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isLoading}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1'
              >
                {isLoading ? 'Updating...' : 'Update Sponsor'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
