import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
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
   * @param key - relative path like "students/{id}/applications/{appId}/passport/file.pdf"
   * @param buffer - file contents
   * @param mimeType - file MIME type
   * @returns public URL or path to access the file
   */
  async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    if (this.driver === 's3') {
      return this.uploadToS3(key, buffer, mimeType);
    }
    return this.uploadToLocal(key, buffer);
  }

  /**
   * Delete a file from storage.
   * @param key - relative path (same format as upload key)
   */
  async delete(key: string): Promise<void> {
    if (this.driver === 's3') {
      return this.deleteFromS3(key);
    }
    return this.deleteFromLocal(key);
  }

  /**
   * Get the public URL for a stored file.
   */
  getUrl(key: string): string {
    if (this.driver === 's3') {
      const endpoint = this.config.get<string>('storage.s3.endpoint', '');
      return `${endpoint}/${this.bucket}/${key}`;
    }
    return `/uploads/${key}`;
  }

  private async uploadToS3(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    await this.s3Client!.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
    return this.getUrl(key);
  }

  private async uploadToLocal(key: string, buffer: Buffer): Promise<string> {
    const filePath = join(process.cwd(), 'uploads', key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
    return `/uploads/${key}`;
  }

  private async deleteFromS3(key: string): Promise<void> {
    await this.s3Client!.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
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
