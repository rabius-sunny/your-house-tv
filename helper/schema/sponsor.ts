import { z } from 'zod';

// Channel schema for creation
export const createSponsorSchema = z.object({
  name: z.string().min(1, 'Sponsor name is required'),
  url: z.string().min(1, 'Website URL is required'),
  designation: z.string().min(1, 'Designation is required')
});

// Type export
export type CreateSponsor = z.infer<typeof createSponsorSchema>;
