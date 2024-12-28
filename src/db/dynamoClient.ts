import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let client : DynamoDBDocumentClient | null = null;
// This function returns a configured DynamoDBDocumentClient
export const dynamoDBClient = (): DynamoDBDocumentClient => {
  if (!client) {
      console.log("Creating new client");
      const cloudDevClient = new DynamoDBClient();
      client = DynamoDBDocumentClient.from(cloudDevClient);
    
      return client;
  } else {
    console.log("Client already created");
  }

  return client;
 
};