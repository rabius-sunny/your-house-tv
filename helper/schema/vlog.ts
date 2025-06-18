import { z } from 'zod';

// VlogType enum for validation
export const VlogTypeSchema = z.enum(['VLOG', 'PODCAST']);

// Vlog schema for creation
export const createVlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  video: z.string().url('Video URL must be valid'),
  isFeatured: z.boolean().optional().default(false),
  type: VlogTypeSchema.optional().default('VLOG'),
  categoryIds: z.array(z.string().min(1, 'Category ID is required'))
});

// Type export
export type CreateVlog = z.infer<typeof createVlogSchema>;
