import { KinesisStreamEvent, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export async function handler(event: KinesisStreamEvent, context: Context) {
  for (const record of event.Records) {
    const data = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString());
    
    await docClient.send(new PutCommand({
      TableName: 'parking_sensor_data',
      Item: {
        sensorId: data.sensorId,
        timestamp: data.timestamp,
        isOccupied: data.isOccupied,
        ttl: Math.floor(Date.now() / 1000) + 86400 // 24 hour TTL
      }
    }));
  }
}