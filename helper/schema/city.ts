import { z } from 'zod';

// City schema for creation
export const createCitySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  isFeatured: z.boolean().optional().default(false),
  networkId: z.string().min(1, 'Network ID is required')
});

// Type export
export type CreateCity = z.infer<typeof createCitySchema>;
