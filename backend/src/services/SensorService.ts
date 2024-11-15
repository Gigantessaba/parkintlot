import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { Redis } from 'ioredis';

export class SensorService {
  private kinesisClient: KinesisClient;
  private redis: Redis;

  constructor() {
    this.kinesisClient = new KinesisClient({ region: process.env.AWS_REGION });
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async processSensorData(sensorId: string, isOccupied: boolean) {
    // Store in Kinesis for processing
    await this.kinesisClient.send(new PutRecordCommand({
      StreamName: 'parking-sensors',
      Data: Buffer.from(JSON.stringify({ sensorId, isOccupied, timestamp: new Date() })),
      PartitionKey: sensorId
    }));

    // Update Redis for real-time access
    await this.redis.set(`sensor:${sensorId}`, JSON.stringify({ isOccupied, lastUpdated: new Date() }));
  }

  async getSensorStatus(sensorId: string) {
    const data = await this.redis.get(`sensor:${sensorId}`);
    return data ? JSON.parse(data) : null;
  }
}