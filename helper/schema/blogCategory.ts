import { z } from 'zod';

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  isFeatured: z.boolean(),
  blogIds: z.array(z.string()).optional()
});

// Type export
export type CreateBlogCategory = z.infer<typeof createBlogCategorySchema>;
