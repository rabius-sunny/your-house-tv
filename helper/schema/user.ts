import { z } from 'zod';

// User schema for creation
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Type export
export type CreateUser = z.infer<typeof createUserSchema>;
