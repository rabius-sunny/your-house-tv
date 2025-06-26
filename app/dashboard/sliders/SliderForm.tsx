'use client';

import ImageUploader from '@/components/shared/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { CreateSlider, createSliderSchema } from '@/helper/schema/sliders';
import request from '@/services/http';
import { Sliders } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SliderFormProps = {
  onCreate: () => void;
  sliderKey?: string;
  title?: string;
  editSlider?: Sliders[0] | null;
  isDialogMode?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function SliderForm({
  onCreate,
  sliderKey = 'hero_sliders',
  title = 'Hero Slider',
  editSlider = null,
  isDialogMode = false,
  open = false,
  onOpenChange
}: SliderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>();
  const isEditMode = Boolean(editSlider);

  const form = useForm<CreateSlider>({
    resolver: zodResolver(createSliderSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      link: '',
      linktext: ''
    }
  });

  // Reset form when editSlider changes
  useEffect(() => {
    if (editSlider) {
      form.reset({
        title: editSlider.title,
        subtitle: editSlider.subtitle,
        description: editSlider.description,
        link: editSlider.link,
        linktext: editSlider.linktext
      });
      setImage(editSlider.image);
    } else {
      form.reset({
        title: '',
        subtitle: '',
        description: '',
        link: '',
        linktext: ''
      });
      setImage(undefined);
    }
  }, [editSlider, form]);

  const onSubmit = async (data: CreateSlider) => {
    try {
      setIsLoading(true);

      // Upload file if selected
      if (!image) {
        toast.error('Please select a slider image');
        return;
      }

      // Submit form data with uploaded image URL and slider key
      const formData = {
        ...data,
        image,
        sliderKey
      };

      if (isEditMode && editSlider) {
        // Update existing slider
        await request.put('/sliders', {
          key: editSlider.key,
          ...formData
        });
        toast.success(`${title} updated successfully!`);
      } else {
        // Create new slider
        await request.post('/sliders', formData);
        toast.success(`${title} created successfully!`);
      }

      onCreate();

      // Close dialog if in dialog mode
      if (isDialogMode && onOpenChange) {
        onOpenChange(false);
      }

      // Reset form only if not in edit mode
      if (!isEditMode) {
        form.reset();
        setImage(undefined);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} slider:`,
        error
      );

      let errorMessage = `Failed to ${
        isEditMode ? 'update' : 'create'
      } ${title.toLowerCase()}`;
      if (error.name === 'ZodError') {
        errorMessage = error.errors[0]?.message || 'Invalid data provided';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(
        `Failed to ${isEditMode ? 'update' : 'create'} ${title.toLowerCase()}`,
        {
          description: errorMessage
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {/* Slider Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slider Title</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter ${title.toLowerCase()} title`}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slider Subtitle */}
        <FormField
          control={form.control}
          name='subtitle'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slider Subtitle</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Enter ${title.toLowerCase()} subtitle`}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slider Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Enter ${title.toLowerCase()} description...`}
                  className='min-h-[80px]'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slider Image Upload */}
        <div className='space-y-2'>
          <Label>Slider Image</Label>
          {image && (
            <div className='mb-2'>
              <p className='text-xs text-muted-foreground mb-1'>
                {isEditMode ? 'Current image:' : 'Uploaded image:'}
              </p>
              <img
                src={image}
                alt={
                  isEditMode ? 'Current slider image' : 'Uploaded slider image'
                }
                className='w-32 h-18 object-cover rounded border border-border/40'
              />
            </div>
          )}
          <ImageUploader
            setSelectedFile={setImage}
            isLoading={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            Recommended size: 1920x1080px (16:9 aspect ratio)
            {isEditMode && ' • Upload a new image to replace the current one'}
          </p>
        </div>

        {/* Link URL */}
        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter link URL (e.g., /videos, https://example.com)'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Link Text */}
        <FormField
          control={form.control}
          name='linktext'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Text</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter link text (e.g., Watch Now, Learn More)'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
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
            {isLoading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? `Update ${title}`
              : `Create ${title}`}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDialogMode) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? `Edit ${title}` : `Create New ${title}`}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>{formContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {isEditMode ? `Edit ${title}` : `Create New ${title}`}
        </CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
