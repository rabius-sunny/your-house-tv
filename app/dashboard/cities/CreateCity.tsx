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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreateCity, createCitySchema } from '@/helper/schema/city';
import request from '@/services/http';
import { City, Network } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CityFormProps = {
  networks: Network[];
  onCreate: () => void;
  editCity?: City | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CityComp({
  onCreate,
  networks,
  editCity = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: CityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isEditMode = Boolean(editCity);

  const form = useForm<CreateCity>({
    resolver: zodResolver(createCitySchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      isFeatured: false,
      networkSlug: ''
    }
  });

  // Reset form when editCity changes
  useEffect(() => {
    if (editCity) {
      form.reset({
        name: editCity.name,
        isFeatured: editCity.isFeatured,
        networkSlug: editCity.network.slug
      });
      setThumbnail(editCity.thumbnail);
    } else {
      form.reset({
        name: '',
        isFeatured: false,
        networkSlug: ''
      });
      setThumbnail(undefined);
    }
  }, [editCity, form]);

  const onSubmit = async (data: CreateCity) => {
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

      if (isEditMode && editCity) {
        // Update existing city
        const response = await request.put('/city', {
          slug: editCity.slug,
          ...formData
        });
        toast.success('City updated successfully!');
      } else {
        // Create new city
        const response = await request.post('/city', formData);
        toast.success('City created successfully!');
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
        `Error ${isEditMode ? 'updating' : 'creating'} city:`,
        error
      );

      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} city`;

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} city`, {
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
        {/* City Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter city name (e.g., New York, Los Angeles)'
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

        {/* Network Selection */}
        <FormField
          control={form.control}
          name='networkSlug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a network' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem
                      key={network.id}
                      value={network.slug}
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
                  Featured City
                </FormLabel>
                <div className='text-sm text-muted-foreground'>
                  Mark this city as featured to highlight it
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
              : `${isEditMode ? 'Update' : 'Create'} City`}
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
              {isEditMode ? 'Edit City' : 'Create New City'}
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
          {isEditMode ? 'Edit City' : 'Create New City'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
