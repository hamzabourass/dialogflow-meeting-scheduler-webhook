import { z } from 'zod';

export const DialogflowParameterSchema = z.object({
  any: z.string().min(1, 'Contact URL is required'),
  connectiontype: z.string().min(1, 'Connection type is required'),
  meeting_time: z.string().min(1, 'Meeting time is required')
});