import { z } from 'zod';

// Settings schema for creation
export const createSettingsSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required')
});

// Type export
export type CreateSettings = z.infer<typeof createSettingsSchema>;
