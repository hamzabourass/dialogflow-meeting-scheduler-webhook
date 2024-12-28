import { z } from 'zod';
import { DialogflowQueryResultSchema } from './queryResult';

export const DialogflowRequestSchema = z.object({
  queryResult: DialogflowQueryResultSchema,
  session: z.string(),
  responseId: z.string()
});