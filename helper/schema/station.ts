import { z } from 'zod';

// Station schema for creation
export const createStationSchema = z
  .object({
    name: z.string().min(1, 'Station name is required'),
    startedAt: z.date(),
    endedAt: z.date(),
    sortOrder: z.number().int().positive().optional(),
    isFeatured: z.boolean(),
    channelId: z.string().min(1, 'Channel ID is required')
  })
  .refine((data) => data.endedAt > data.startedAt, {
    message: 'End date must be after start date',
    path: ['endedAt']
  });

// Type export
export type CreateStation = z.infer<typeof createStationSchema>;
