import { z } from 'zod';
import { ApplicationError } from '../errors/errors';
import { formatDialogflowResponse } from './dialogflow';

const FRIENDLY_FIELD_NAMES: Record<string, string> = {
  any: 'contact URL',
  connectiontype: 'meeting type',
  meeting_time: 'meeting time'
};

export const handleError = (error: unknown, session?: string) => {
  console.error('Error registering meeting:', error);

  if (error instanceof z.ZodError) {
    const errorMessage = error.errors.map(err => {
      const fieldName = err.path[err.path.length - 1];
      return `${FRIENDLY_FIELD_NAMES[fieldName as string] || fieldName} is required`;
    }).join(', ');
    
    return formatDialogflowResponse(
      `I couldn't schedule the meeting. ${errorMessage}. Could you please provide this information?`,
      session
    );
  }

  if (error instanceof ApplicationError) {
    return formatDialogflowResponse(
      `Sorry, there was a problem: ${error.message}`,
      session
    );
  }

  return formatDialogflowResponse(
    'Sorry, I encountered an error while scheduling your meeting. Please try again.',
    session
  );
};