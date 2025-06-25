'use client';

import ImageUploader from '@/components/shared/ImageUploader';
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
import { Textarea } from '@/components/ui/textarea';
import { CreateVlogCategory, createVlogCategorySchema } from '@/helper/schema';
import request from '@/services/http';
import { VlogCategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TProps = {
  onCategoryCreated: () => void;
  editCategory?: VlogCategory | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CategoryForm({
  onCategoryCreated,
  editCategory = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: TProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isEditMode = Boolean(editCategory);

  const form = useForm<CreateVlogCategory>({
    resolver: zodResolver(createVlogCategorySchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      isFeatured: false
    }
  });

  // Reset form when editCategory changes
  useEffect(() => {
    if (editCategory) {
      form.reset({
        name: editCategory.name,
        description: editCategory.description || '',
        isFeatured: editCategory.isFeatured
      });
      setThumbnail(editCategory.thumbnail);
    } else {
      form.reset({
        name: '',
        description: '',
        isFeatured: false
      });
      setThumbnail(undefined);
    }
  }, [editCategory, form]);

  const onSubmit = async (data: CreateVlogCategory) => {
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

      if (isEditMode && editCategory) {
        // Update existing category
        await request.put('/category', {
          slug: editCategory.slug,
          ...formData
        });
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        await request.post('/category', formData);
        toast.success('Category created successfully!');
      }

      onCategoryCreated();

      // Close dialog if in dialog mode
      if (isDialogMode && onOpenChange) {
        onOpenChange(false);
      }

      // Reset form only if not in edit mode
      if (!isEditMode) {
        form.reset();
        setThumbnail(undefined);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} category:`,
        error
      );

      let errorMessage = `Failed to ${
        isEditMode ? 'update' : 'create'
      } category`;

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} category`, {
        description: errorMessage
      });
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
        {/* Category Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter category name (e.g., HBO, Netflix)'
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
          {isEditMode && thumbnail && (
            <div className='mb-2'>
              <p className='text-xs text-muted-foreground mb-1'>
                Current thumbnail:
              </p>
              <img
                src={thumbnail}
                alt='Current thumbnail'
                className='w-24 h-16 object-cover rounded border border-border/40'
              />
            </div>
          )}
          <ImageUploader
            setSelectedFile={setThumbnail}
            isLoading={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            Recommended size: 400x280px
            {isEditMode && ' • Upload a new image to replace the current one'}
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
                  Featured Category
                </FormLabel>
                <div className='text-sm text-muted-foreground'>
                  Mark this category as featured to highlight it
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
            disabled={isLoading}
            className={isDialogMode ? 'flex-1' : 'flex-1'}
          >
            {isLoading
              ? `${isEditMode ? 'Updating...' : 'Creating...'}`
              : `${isEditMode ? 'Update' : 'Create'} Category`}
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
              {isEditMode ? 'Edit Category' : 'Create New Category'}
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
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
