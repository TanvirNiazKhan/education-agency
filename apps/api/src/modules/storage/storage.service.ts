import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

@Injectable()
export class StorageService {
  private readonly driver: 'local' | 's3';
  private readonly s3Client: S3Client | null = null;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.get<'local' | 's3'>('storage.driver', 'local');
    this.bucket = this.config.get<string>('storage.s3.bucket', '');

    if (this.driver === 's3') {
      this.s3Client = new S3Client({
        endpoint: this.config.get<string>('storage.s3.endpoint'),
        region: this.config.get<string>('storage.s3.region'),
        credentials: {
          accessKeyId: this.config.get<string>('storage.s3.accessKeyId', ''),
          secretAccessKey: this.config.get<string>('storage.s3.secretAccessKey', ''),
        },
        forcePathStyle: true,
      });
    }
  }

  /**
   * Upload a file buffer to storage.
   * Returns the storage key (not a URL) — use getSignedUrl() to get accessible URL.
   */
  async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    if (this.driver === 's3') {
      await this.s3Client!.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }),
      );
      return key;
    }
    return this.uploadToLocal(key, buffer);
  }

  /**
   * Delete a file from storage.
   */
  async delete(key: string): Promise<void> {
    if (this.driver === 's3') {
      await this.s3Client!.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return;
    }
    return this.deleteFromLocal(key);
  }

  /**
   * Get an accessible URL for a stored file.
   * For S3: returns a presigned URL (default 1 hour expiry).
   * For local: returns the /uploads/... path.
   */
  async getAccessUrl(fileUrl: string, expiresInSeconds = 3600): Promise<string> {
    if (this.driver !== 's3') {
      return fileUrl;
    }

    const key = this.extractKey(fileUrl);
    return getSignedUrl(
      this.s3Client!,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  /**
   * Extract the S3 key from a stored file_url value.
   * Handles both raw keys ("students/...") and legacy "/uploads/..." paths.
   */
  extractKey(fileUrl: string): string {
    if (fileUrl.startsWith('/uploads/')) {
      return fileUrl.replace('/uploads/', '');
    }
    // Already a raw key
    return fileUrl;
  }

  private async uploadToLocal(key: string, buffer: Buffer): Promise<string> {
    const filePath = join(process.cwd(), 'uploads', key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
    return `/uploads/${key}`;
  }

  private async deleteFromLocal(key: string): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'uploads', key);
      await unlink(filePath);
    } catch {
      // File may already be gone
    }
  }
}
