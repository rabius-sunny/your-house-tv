'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import TextEditor from '@/components/shared/TextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
import { createBlogSchema } from '@/helper/schema/blog';
import request from '@/services/http';
import { Blog, BlogCategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type CreateBlogFormData = z.infer<typeof createBlogSchema>;

export default function BlogForm({
  categories,
  onSuccess,
  editBlog = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: {
  categories: BlogCategory[];
  onSuccess?: () => void;
  editBlog?: Blog | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>();
  const [description, setDescription] = useState<string>('');
  const isEditMode = Boolean(editBlog);

  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      isFeatured: false,
      categoryIds: []
    }
  });

  // Reset form when editBlog changes
  useEffect(() => {
    if (editBlog) {
      form.reset({
        title: editBlog.title,
        isFeatured: editBlog.isFeatured,
        categoryIds: editBlog.categoryIds || []
      });
      setSelectedThumbnail(editBlog.thumbnail);
      setDescription(editBlog.description || '');
    } else {
      form.reset({
        title: '',
        isFeatured: false,
        categoryIds: []
      });
      setSelectedThumbnail(undefined);
      setDescription('');
    }
  }, [editBlog, form]);

  const onSubmit = async (data: CreateBlogFormData) => {
    try {
      setIsLoading(true);

      if (!selectedThumbnail) {
        toast.error('Please upload a thumbnail image');
        return;
      }

      const formData = {
        ...data,
        description,
        thumbnail: selectedThumbnail
      };

      if (isEditMode && editBlog) {
        // Update existing blog
        await request.put('/blogs', {
          slug: editBlog.slug,
          ...formData
        });
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        await request.post('/blogs', formData);
        toast.success('Blog created successfully!');
      }

      onSuccess?.();

      // Close dialog if in dialog mode
      if (isDialogMode && onOpenChange) {
        onOpenChange(false);
      }

      // Reset form only if not in edit mode
      if (!isEditMode) {
        form.reset();
        setSelectedThumbnail(undefined);
        setDescription('');
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} blog:`,
        error
      );
      const errorMessage =
        error?.response?.data?.error ||
        `Failed to ${isEditMode ? 'update' : 'create'} blog`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const FormContent = () => (
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
        <div className='space-y-2'>
          <Label className='block'>Blog Post</Label>
          <TextEditor
            state={description}
            setState={setDescription}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className='space-y-2'>
          <Label>Thumbnail Image</Label>
          {isEditMode && selectedThumbnail && (
            <div className='mb-2'>
              <p className='text-xs text-muted-foreground mb-1'>
                Current thumbnail:
              </p>
              <img
                src={selectedThumbnail}
                alt='Current thumbnail'
                className='w-24 h-16 object-cover rounded border border-border/40'
              />
            </div>
          )}
          <ImageUploader
            setSelectedFile={setSelectedThumbnail}
            isLoading={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            Recommended size: 400x280px
            {isEditMode && ' • Upload a new image to replace the current one'}
          </p>
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
          {isDialogMode && (
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange?.(false)}
              disabled={isLoading}
              className='flex-1'
            >
              Cancel
            </Button>
          )}
          <Button
            type='submit'
            disabled={isLoading || categories.length === 0}
            className={isDialogMode ? 'flex-1' : 'min-w-[120px]'}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              `${isEditMode ? 'Update' : 'Create'} Blog`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  // Render in dialog mode
  if (isDialogMode) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className='max-w-2xl w-full mx-auto max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4 w-full'>
            <FormContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render in card mode (original layout)
  return (
    <Card className='w-full max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur-sm'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </CardTitle>
        <p className='text-muted-foreground text-sm'>
          {isEditMode
            ? 'Update your blog post details and categories'
            : 'Create a new blog post and assign it to categories'}
        </p>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
