import { z } from 'zod';

// Blog schema for creation
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  isFeatured: z.boolean(),
  categoryIds: z.array(z.string().min(1, 'Category ID is required'))
});

// Type export
export type CreateBlog = z.infer<typeof createBlogSchema>;
