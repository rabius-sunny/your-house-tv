import { z } from 'zod';

// Channel schema for creation
export const createChannelSchema = z.object({
  name: z.string().min(1, 'Channel name is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  isFeatured: z.boolean().optional().default(false),
  cityId: z.string().min(1, 'City ID is required')
});

// Type export
export type CreateChannel = z.infer<typeof createChannelSchema>;
