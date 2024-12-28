import { MeetingRecord } from "src/types/meeting";
import { dynamoDBClient } from "../db/dynamoClient";
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = dynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MEETING_TABLE_NAME || 'MeetingDetails';


export const scheduleMeeting = async(meeting: MeetingRecord): Promise<void> => {

    const command = new PutCommand({ TableName: TABLE_NAME,
        Item: meeting,
        ConditionExpression: 'attribute_not_exists(meetingId)' 
    });

    await docClient.send(command);
}