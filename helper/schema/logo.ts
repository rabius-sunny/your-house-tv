import { z } from 'zod';

// Logo schema for creation/update
export const createLogoSchema = z.object({
  logo: z
    .string()
    .url('Logo must be a valid URL')
    .min(1, 'Logo URL is required')
});

// Type export
export type CreateLogo = z.infer<typeof createLogoSchema>;
