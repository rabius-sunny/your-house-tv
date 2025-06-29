import { z } from 'zod';

// Channel schema for creation
export const createSponsorSchema = z.object({
  name: z.string().min(1, 'Sponsor name is required'),
  website: z.string().optional(),
  designation: z.string().optional(),
  stationIds: z.array(z.string()).min(1, 'At least one station ID is required')
});

// Type export
export type CreateSponsor = z.infer<typeof createSponsorSchema>;
