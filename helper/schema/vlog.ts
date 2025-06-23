import { z } from 'zod';

// VlogType enum for validation
export const VlogTypeSchema = z.enum(['VLOG', 'PODCAST']);

// Vlog schema for creation
export const createVlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sortOrder: z.number().int().positive().optional(),
  isFeatured: z.boolean(),
  type: VlogTypeSchema.optional().default('VLOG'),
  categoryIds: z.array(z.string().min(1, 'Category ID is required'))
});

// Type export
export type CreateVlog = z.infer<typeof createVlogSchema>;
