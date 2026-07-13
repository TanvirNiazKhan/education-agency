import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationAdminDto, ChangeStatusDto } from './dto/update-application.dto';
import { ApplicationDocument } from './entities/application-document.entity';

@ApiTags('Admin Applications')
@Controller('admin/applications')
export class AdminApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly config: ConfigService,
    @InjectRepository(ApplicationDocument)
    private readonly documentRepo: Repository<ApplicationDocument>,
  ) {}

  @Get()
  async getAllApplications() {
    return this.applicationsService.getAllApplications();
  }

  @Get(':id')
  async getApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.applicationsService.getByIdAdmin(id);
  }

  @Patch(':id')
  async updateApplication(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationAdminDto,
  ) {
    return this.applicationsService.updateAdmin(id, dto);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.applicationsService.changeStatusAdmin(id, dto);
  }

  @Get(':id/documents/:docId/download')
  async downloadDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('docId', ParseUUIDPipe) docId: string,
    @Res() res: Response,
  ) {
    const doc = await this.documentRepo.findOne({
      where: { id: docId, application_id: id },
    });
    if (!doc) throw new NotFoundException('Document not found');

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.file_name)}"`);
    res.setHeader('Content-Type', doc.mime_type || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const driver = this.config.get<string>('storage.driver', 'local');

    if (driver === 's3') {
      const s3 = new S3Client({
        endpoint: this.config.get<string>('storage.s3.endpoint'),
        region: this.config.get<string>('storage.s3.region'),
        credentials: {
          accessKeyId: this.config.get<string>('storage.s3.accessKeyId', ''),
          secretAccessKey: this.config.get<string>('storage.s3.secretAccessKey', ''),
        },
        forcePathStyle: true,
      });

      // Extract key from URL
      const parts = doc.file_url.split('/');
      const startIdx = parts.findIndex((p) => p === 'students' || p === 'avatars');
      const key = startIdx !== -1 ? parts.slice(startIdx).join('/') : doc.file_url;

      const result = await s3.send(
        new GetObjectCommand({
          Bucket: this.config.get<string>('storage.s3.bucket'),
          Key: key,
        }),
      );
      (result.Body as NodeJS.ReadableStream).pipe(res);
    } else {
      const filePath = join(process.cwd(), doc.file_url);
      if (!existsSync(filePath)) throw new NotFoundException('File not found on disk');
      createReadStream(filePath).pipe(res);
    }
  }
}
