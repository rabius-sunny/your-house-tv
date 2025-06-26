'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateContact, createContactSchema } from '@/helper/schema/contact';
import request from '@/services/http';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateContact>({
    resolver: zodResolver(createContactSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: CreateContact) => {
    try {
      setIsLoading(true);

      await request.post('/contact', data);

      router.push('/'); // Redirect to home page or desired route
      toast.success('Message sent successfully!', {
        description:
          'Thank you for contacting us. We will get back to you soon.'
      });

      // Reset form after successful submission
      form.reset();
    } catch (error: any) {
      console.error('Error sending contact message:', error);

      let errorMessage = 'Failed to send message';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error('Failed to send message', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto my-20'>
      <h1 className='text-3xl text-center mb-10 uppercase'>Keep in Touch</h1>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your full name'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter your email address'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone </FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='Enter your phone number'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter your message here...'
                      className='min-h-32'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
