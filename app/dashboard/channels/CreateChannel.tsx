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
import { Textarea } from '@/components/ui/textarea';
import { CreateChannel, createChannelSchema } from '@/helper/schema';
import request from '@/services/http';
import { Channel, City } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ChannelFormProps = {
  cities: City[];
  onChannelCreated?: () => void;
  editChannel?: Channel | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ChannelComp({
  cities: networks,
  onChannelCreated,
  editChannel = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: ChannelFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isEditMode = Boolean(editChannel);

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

  // Reset form when editChannel changes
  useEffect(() => {
    if (editChannel) {
      form.reset({
        name: editChannel.name,
        description: editChannel.description,
        isFeatured: editChannel.isFeatured,
        cityId: editChannel.cityId
      });
      setThumbnail(editChannel.thumbnail);
    } else {
      form.reset({
        name: '',
        description: '',
        isFeatured: false,
        cityId: ''
      });
      setThumbnail(undefined);
    }
  }, [editChannel, form]);

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

      if (isEditMode && editChannel) {
        // Update existing channel
        const response = await request.put('/channel', {
          id: editChannel.id,
          ...formData
        });
        toast.success('Channel updated successfully!');
      } else {
        // Create new channel
        const response = await request.post('/channel', formData);
        toast.success('Channel created successfully!');
      }

      // Call the callback if provided
      if (onChannelCreated) {
        onChannelCreated();
      }

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
        `Error ${isEditMode ? 'updating' : 'creating'} channel:`,
        error
      );

      let errorMessage = `Failed to ${
        isEditMode ? 'update' : 'create'
      } channel`;

      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} channel`, {
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

        {/* Network Selection */}
        <FormField
          control={form.control}
          name='cityId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
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
              : `${isEditMode ? 'Update' : 'Create'} Channel`}
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
              {isEditMode ? 'Edit Channel' : 'Create New Channel'}
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
          {isEditMode ? 'Edit Channel' : 'Create New Channel'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
