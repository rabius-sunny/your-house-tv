import { z } from 'zod';

// Gallery schema for creation
export const createGallerySchema = z.object({
  fileId: z.string().min(1, 'File ID is required'),
  url: z.string().url('URL must be a valid URL')
});

// Type export
export type CreateGallery = z.infer<typeof createGallerySchema>;
