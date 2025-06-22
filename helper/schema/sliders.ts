import { z } from 'zod';

// Channel schema for creation
export const createSliderSchema = z.object({
  title: z.string().min(1, 'Slider title is required'),
  subtitle: z.string().min(1, 'Slider subtitle is required'),
  description: z.string().min(1, 'Slider description is required'),
  link: z.string().min(1, 'Slider link is required'),
  linktext: z.string().min(1, 'Slider link text is required')
});

// Type export
export type CreateSlider = z.infer<typeof createSliderSchema>;
