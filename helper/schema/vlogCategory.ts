import { z } from 'zod';

// VlogCategory schema for creation
export const createVlogCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
  isFeatured: z.boolean(),
  vlogIds: z.array(z.string()).optional()
});

// Type export
export type CreateVlogCategory = z.infer<typeof createVlogCategorySchema>;
