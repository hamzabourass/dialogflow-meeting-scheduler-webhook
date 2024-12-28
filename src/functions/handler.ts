import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dynamoDBClient } from "../db/dynamoClient";
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const client = dynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.MEETING_TABLE_NAME || 'MeetingDetails';

const DialogflowParameterSchema = z.object({
  any: z.string().min(1, 'Contact URL is required'),
  connectiontype: z.string().min(1, 'Connection type is required'),
  meeting_time: z.string().min(1, 'Meeting time is required')
});

const DialogflowQueryResultSchema = z.object({
  parameters: DialogflowParameterSchema,
  queryText: z.string(),
  languageCode: z.string()
});

const DialogflowRequestSchema = z.object({
  queryResult: DialogflowQueryResultSchema,
  session: z.string(),
  responseId: z.string()
});


interface MeetingRecord {
  meetingId: string;
  contactUrl: string;
  connectionType: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;
}

class ApplicationError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}

const formatDialogflowResponse = (
  fulfillmentText: string,
  payload?: Record<string, any>
): APIGatewayProxyResult => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    fulfillmentMessages: [
      {
        text: {
          text: [fulfillmentText]
        }
      }
    ],
    outputContexts: [],
    source: "lambda-webhook"
  })
});

export const registerMeeting = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received event body:', event.body);
    
    const dialogflowRequest = DialogflowRequestSchema.parse(JSON.parse(event.body || '{}'));
    const params = dialogflowRequest.queryResult.parameters;
    console.log('Extracted parameters:', params);

    const meetingItem: MeetingRecord = {
      meetingId: uuidv4(),
      contactUrl: params.any,
      connectionType: params.connectiontype,
      dateTime: params.meeting_time,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: meetingItem,
      ConditionExpression: 'attribute_not_exists(meetingId)',
    }));

    const meetingDate = new Date(meetingItem.dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return formatDialogflowResponse(
      `Perfect! I've scheduled a ${meetingItem.connectionType} for ${meetingDate}. I'll send the details to ${meetingItem.contactUrl}.`
    );

  } catch (error) {
    console.error('Error registering meeting:', error);

    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => {
        const fieldName = err.path[err.path.length - 1];
        const friendlyFieldNames: Record<string, string> = {
          any: 'contact URL',
          connectiontype: 'meeting type',
          meeting_time: 'meeting time'
        };
        return `${friendlyFieldNames[fieldName as string] || fieldName} is required`;
      }).join(', ');
      
      return formatDialogflowResponse(
        `I couldn't schedule the meeting. ${errorMessage}. Could you please provide this information?`
      );
    }

    if (error instanceof ApplicationError) {
      return formatDialogflowResponse(
        `Sorry, there was a problem: ${error.message}`
      );
    }

    return formatDialogflowResponse(
      'Sorry, I encountered an error while scheduling your meeting. Please try again.'
    );
  }
};