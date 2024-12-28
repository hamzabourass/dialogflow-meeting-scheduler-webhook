import { z } from 'zod';

export const DialogflowParameterSchema = z.object({
  any: z.string().min(1, 'Contact URL is required'),
  connectiontype: z.string().min(1, 'Connection type is required'),
  meeting_time: z.string().min(1, 'Meeting time is required')
});

export const DialogflowQueryResultSchema = z.object({
  parameters: DialogflowParameterSchema,
  queryText: z.string(),
  languageCode: z.string()
});

export const DialogflowRequestSchema = z.object({
  queryResult: DialogflowQueryResultSchema,
  session: z.string(),
  responseId: z.string()
});

export type DialogflowRequest = z.infer<typeof DialogflowRequestSchema>;
export type MeetingInput = z.infer<typeof DialogflowParameterSchema>;

export interface MeetingRecord {
  meetingId: string;
  contactUrl: string;
  connectionType: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;
}