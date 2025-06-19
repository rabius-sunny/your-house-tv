import { z } from 'zod';

// Channel schema for creation
export const createChannelSchema = z.object({
  name: z.string().min(1, 'Channel name is required'),
  description: z.string().min(1, 'Description is required'),
  isFeatured: z.boolean(),
  cityId: z.string().min(1, 'City ID is required')
});

// Type export
export type CreateChannel = z.infer<typeof createChannelSchema>;
