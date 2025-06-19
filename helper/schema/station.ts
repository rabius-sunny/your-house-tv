import { z } from 'zod';

// Station schema for creation
export const createStationSchema = z
  .object({
    name: z.string().min(1, 'Station name is required'),
    startedAt: z.date(),
    endedAt: z.date(),
    videos: z.array(z.string().url('Video URL must be valid')),
    isFeatured: z.boolean(),
    channelId: z.string().min(1, 'Channel ID is required')
  })
  .refine((data) => data.endedAt > data.startedAt, {
    message: 'End date must be after start date',
    path: ['endedAt']
  });

// Type export
export type CreateStation = z.infer<typeof createStationSchema>;
