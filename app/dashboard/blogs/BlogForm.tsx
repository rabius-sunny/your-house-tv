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
import { Textarea } from '@/components/ui/textarea';
import { createBlogSchema } from '@/helper/schema/blog';
import request from '@/services/http';
import { BlogCategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type CreateBlogFormData = z.infer<typeof createBlogSchema>;

export default function BlogForm({
  categories,
  onSuccess
}: {
  categories: BlogCategory[];
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>();

  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      description: '',
      isFeatured: false,
      categoryIds: []
    }
  });

  const onSubmit = async (data: CreateBlogFormData) => {
    try {
      setIsLoading(true);

      if (!selectedThumbnail) {
        toast.error('Please upload a thumbnail image');
        return;
      }

      const formData = {
        ...data,
        thumbnail: selectedThumbnail
      };

      await request.post('/blogs', formData);

      toast.success('Blog created successfully!');
      form.reset();
      setSelectedThumbnail(undefined);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating blog:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to create blog';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur-sm'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
          Create New Blog Post
        </CardTitle>
        <p className='text-muted-foreground text-sm'>
          Create a new blog post and assign it to categories
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Blog Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter blog title'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Blog Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter blog description'
                      {...field}
                      disabled={isLoading}
                      className='min-h-[120px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload */}
            <div className='space-y-2'>
              <Label>Thumbnail Image</Label>
              <ImageUploader
                setSelectedFile={setSelectedThumbnail}
                isLoading={isLoading}
              />
            </div>

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
                      No categories available. Create blog categories first.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Checkbox */}
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm font-normal'>
                      Featured Blog
                    </FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      Featured blogs will be displayed prominently on the site
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading || categories.length === 0}
                className='min-w-[120px]'
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    Creating...
                  </div>
                ) : (
                  'Create Blog'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
