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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const userCreateSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type UserCreateForm = z.infer<typeof userCreateSchema>;

type UserCreateFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
};

export default function UserCreateForm({
  open,
  onOpenChange,
  onUserCreated
}: UserCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserCreateForm>({
    resolver: zodResolver(userCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserCreateForm) => {
    try {
      setIsLoading(true);

      await request.post('/users', data);

      toast.success('User created successfully!');
      onUserCreated();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error('Error creating user:', error);

      let errorMessage = 'Failed to create user';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to create user', {
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
          <DialogTitle>Create New User</DialogTitle>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter password'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
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
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
