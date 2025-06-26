'use client';

import { Button } from '@/components/ui/button';
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
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const userFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal(''))
});

type UserFormData = z.infer<typeof userFormSchema>;

type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type UserFormProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
};

export default function UserEditForm({
  user,
  open,
  onOpenChange,
  onUserSaved
}: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(user);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        password: ''
      });
    } else {
      form.reset({
        email: '',
        password: ''
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);

      if (isEditMode && user) {
        // Update existing user
        const payload: any = {
          id: user.id,
          email: data.email
        };

        if (data.password && data.password.trim() !== '') {
          payload.password = data.password;
        }

        await request.put('/users', payload);
        toast.success('User updated successfully!');
      } else {
        // Create new user
        if (!data.password || data.password.trim() === '') {
          toast.error('Password is required when creating a new user');
          return;
        }

        await request.post('/users', {
          email: data.email,
          password: data.password
        });
        toast.success('User created successfully!');
      }

      onUserSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} user:`,
        error
      );

      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} user`;
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} user`, {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter email address'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {isEditMode ? '(optional)' : ''}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={
                        isEditMode
                          ? 'Enter new password (leave empty to keep current)'
                          : 'Enter password'
                      }
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                  {isEditMode && (
                    <p className='text-xs text-muted-foreground'>
                      Leave empty to keep the current password
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
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
                {isLoading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                  ? 'Update User'
                  : 'Create User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
