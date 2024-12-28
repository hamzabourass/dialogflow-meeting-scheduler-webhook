import { DialogflowParameterSchema } from 'src/schemas/dialogflow/parameter';
import { DialogflowRequestSchema } from 'src/schemas/dialogflow/request';
import { z } from 'zod';

export type DialogflowRequest = z.infer<typeof DialogflowRequestSchema>;
export type DialogflowParameter = z.infer<typeof DialogflowParameterSchema>;