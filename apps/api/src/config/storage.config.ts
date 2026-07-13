import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  driver: (process.env.STORAGE_DRIVER || 'local') as 'local' | 's3',
  s3: {
    endpoint: process.env.S3_ENDPOINT || '',
    region: process.env.S3_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
}));
