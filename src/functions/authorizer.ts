import { 
    APIGatewayTokenAuthorizerEvent,
    APIGatewayAuthorizerResult
  } from 'aws-lambda';
  
  type StatementEffect = 'Allow' | 'Deny';
  
  const generatePolicy = (
    principalId: string,
    effect: StatementEffect,
    resource: string
  ): APIGatewayAuthorizerResult => {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
          }
        ]
      }
    };
  };
  
  const validateToken = async (token: string): Promise<boolean> => {
    const validToken = process.env.API_TOKEN;
    return token === validToken;
  };
  
  export const handler = async (
    event: APIGatewayTokenAuthorizerEvent
  ): Promise<APIGatewayAuthorizerResult> => {
    try {
      console.log('Auth event:', JSON.stringify(event, null, 2));
  
      // Extract token from Authorization header
      const authHeader = event.authorizationToken;
      if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
        console.log('Missing or invalid Authorization header');
        return generatePolicy('user', 'Deny', event.methodArn);
      }
  
      const token = authHeader.split(' ')[1];
      const isValid = await validateToken(token);
  
      if (!isValid) {
        console.log('Invalid token');
        return generatePolicy('user', 'Deny', event.methodArn);
      }
  
      return generatePolicy('user', 'Allow', event.methodArn);
  
    } catch (error) {
      console.error('Authorization error:', error);
      return generatePolicy('user', 'Deny', event.methodArn);
    }
  };