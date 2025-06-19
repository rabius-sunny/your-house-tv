import { z } from 'zod';

// Network schema for creation
export const createNetworkSchema = z.object({
  name: z.string().min(1, 'Network name is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  isFeatured: z.boolean()
});

// Type export
export type CreateNetwork = z.infer<typeof createNetworkSchema>;
