import { S3Client } from '@aws-sdk/client-s3'

// Debug environment variables
console.log('R2 Environment Check:', {
  hasAccountId: !!process.env.R2_ACCOUNT_ID,
  hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
  hasBucketName: !!process.env.R2_BUCKET_NAME,
  accountId: process.env.R2_ACCOUNT_ID?.substring(0, 8) + '...' // Partial for security
})

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Add this
})

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!