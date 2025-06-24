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
import { CreateBlogCategory, createBlogCategorySchema } from '@/helper/schema';
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TProps = {
  onCategoryCreated: () => void;
};

export default function BlogCategoryForm({ onCategoryCreated }: TProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();

  const form = useForm<CreateBlogCategory>({
    resolver: zodResolver(createBlogCategorySchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      isFeatured: false
    }
  });

  const onSubmit = async (data: CreateBlogCategory) => {
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

      const response = await request.post('/blog-category', formData);

      toast.success('Blog category created successfully!');
      onCategoryCreated();

      form.reset();
      setThumbnail(undefined);
    } catch (error: any) {
      console.error('Error creating blog category:', error);
      const errorMessage =
        error?.response?.data?.error || 'Failed to create blog category';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur-sm'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
          Create New Blog Category
        </CardTitle>
        <p className='text-muted-foreground text-sm'>
          Add a new blog category to organize your blog posts
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Category Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter category name (e.g., Technology, Travel, Lifestyle)'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter category description'
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
                Upload an image to represent this blog category. Recommended
                size: 400x300px
              </p>
            </div>

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
                      Featured Category
                    </FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      Featured categories will be displayed prominently on the
                      site
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='min-w-[120px]'
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    Creating...
                  </div>
                ) : (
                  'Create Category'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
