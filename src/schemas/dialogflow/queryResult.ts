import { z } from 'zod';
import { DialogflowParameterSchema } from './parameter';

export const DialogflowQueryResultSchema = z.object({
  parameters: DialogflowParameterSchema,
  queryText: z.string(),
  languageCode: z.string(),
  action: z.string()
});