import { z } from 'zod';

// Contact schema for creation
export const createContactSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, ' message is required')
});

// Type export
export type CreateContact = z.infer<typeof createContactSchema>;
