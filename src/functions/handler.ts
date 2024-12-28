import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DATE_FORMAT_OPTIONS, INTENT_NAMES } from 'src/constants/dialogflow';
import { Meeting } from 'src/models/meeting';
import { DialogflowRequestSchema } from 'src/schemas/dialogflow/request';
import { scheduleMeeting } from 'src/services/meetingService';
import { formatDialogflowResponse, formatEmptyResponse } from 'src/utils/dialogflow';
import { handleError } from 'src/utils/errorHandler';
import { v4 as uuidv4 } from 'uuid';


export const registerMeeting = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  
  console.log('Received event body:', event.body);
  const requestBody = JSON.parse(event.body || '{}');
  try {
   
    console.log('Intent information:', {
      intentName: requestBody?.queryResult?.action,
      intentInfo: requestBody?.queryResult?.intent,
      fullQueryResult: requestBody?.queryResult
    });

    if (requestBody?.queryResult?.action !== INTENT_NAMES.SCHEDULE_MEETING) {
      return formatEmptyResponse();
    }

    const dialogflowRequest = DialogflowRequestSchema.parse(requestBody);
    const params = dialogflowRequest.queryResult.parameters;
    console.log('Extracted parameters:', params);

    const meeting = Meeting.fromDialogflowParams({
      any: params.any,
      connectiontype: params.connectiontype,
      meeting_time: params.meeting_time,
      meetingId: uuidv4()

    });

    await scheduleMeeting(meeting);

    const meetingDate = new Date(meeting.dateTime).toLocaleString('en-US', DATE_FORMAT_OPTIONS);

    return formatDialogflowResponse(
      `Perfect! I've scheduled a ${meeting.connectionType} for ${meetingDate}. I'll send the details to ${meeting.contactUrl}.`,
      requestBody.session
    );

  } catch (error) {
    return handleError(error, requestBody?.session);
  }
};