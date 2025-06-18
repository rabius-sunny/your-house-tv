import { z } from 'zod';

// Network schema for creation
export const createNetworkSchema = z.object({
  name: z.string().min(1, 'Network name is required'),
  isFeatured: z.boolean()
});

// Type export
export type CreateNetwork = z.infer<typeof createNetworkSchema>;
