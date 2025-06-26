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
import { CreateNetwork, createNetworkSchema } from '@/helper/schema/network';
import request from '@/services/http';
import { Network } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type NetworkFormProps = {
  onCreate: () => void;
  editNetwork?: Network | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function NetworkComp({
  onCreate,
  editNetwork = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: NetworkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isEditMode = Boolean(editNetwork);

  const form = useForm<CreateNetwork>({
    resolver: zodResolver(createNetworkSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      isFeatured: false,
      sortOrder: 0
    }
  });

  // Reset form when editNetwork changes
  useEffect(() => {
    if (editNetwork) {
      form.reset({
        name: editNetwork.name,
        isFeatured: editNetwork.isFeatured,
        sortOrder: editNetwork.sortOrder
      });
      setThumbnail(editNetwork.thumbnail);
    } else {
      form.reset({
        name: '',
        isFeatured: false,
        sortOrder: 0
      });
      setThumbnail(undefined);
    }
  }, [editNetwork, form]);

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

      if (isEditMode && editNetwork) {
        // Update existing network
        await request.put('/network', {
          slug: editNetwork.slug,
          ...formData
        });
        toast.success('Network updated successfully!');
      } else {
        // Create new network
        await request.post('/network', formData);
        toast.success('Network created successfully!');
      }

      onCreate();

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
        `Error ${isEditMode ? 'updating' : 'creating'} network:`,
        error
      );

      let errorMessage = `Failed to ${
        isEditMode ? 'update' : 'create'
      } network`;

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} network`, {
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
        {/* Network Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter network name (e.g., NORTH CAROLINA, SOUTH CAROLINA)'
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
          {thumbnail && (
            <div className='mb-2'>
              <p className='text-xs text-muted-foreground mb-1'>
                {isEditMode ? 'Current thumbnail:' : 'Uploaded thumbnail:'}
              </p>
              <img
                src={thumbnail}
                alt={isEditMode ? 'Current thumbnail' : 'Uploaded thumbnail'}
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

        {/* Sort Order */}
        <FormField
          control={form.control}
          name='sortOrder'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter display order (1, 2, 3...)'
                  {...field}
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  disabled={isLoading}
                  min='0'
                />
              </FormControl>
              <div className='text-xs text-muted-foreground'>
                Lower numbers appear first (1 = first position)
              </div>
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
            className='flex-1'
          >
            {isLoading
              ? `${isEditMode ? 'Updating' : 'Creating'}...`
              : `${isEditMode ? 'Update' : 'Create'} Network`}
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
        <DialogContent className='max-w-2xl mx-auto max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {isEditMode ? 'Edit Network' : 'Create New Network'}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
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
          {isEditMode ? 'Edit Network' : 'Create New Network'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
