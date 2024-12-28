import { APIGatewayProxyResult } from 'aws-lambda';

export const formatDialogflowResponse = (
  fulfillmentText: string,
  session?: string
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
    outputContexts: session ? [
      {
        name: `${session}/contexts/contactinfo-followup`,
        lifespanCount: 0
      },
      {
        name: `${session}/contexts/follow-upintent-platformselected-followup`,
        lifespanCount: 0
      },
      {
        name: `${session}/contexts/schedulingameetingorcoffee-followup`,
        lifespanCount: 0
      }
    ] : [],
    endInteraction: true,
    source: "lambda-webhook"
  })
});

export const formatEmptyResponse = (): APIGatewayProxyResult => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({})
});