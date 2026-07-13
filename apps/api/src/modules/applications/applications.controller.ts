import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

// Allowed MIME types
const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@ApiTags('Applications')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async getMyApplications(@Request() req: any) {
    return this.applicationsService.getMyApplications(req.user.id);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.applicationsService.getById(id, req.user.id);
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.id, dto);
  }

  @Get(':id/documents')
  async getDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.applicationsService.getDocuments(id, req.user.id);
  }

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        doc_type: { type: 'string', example: 'passport' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          // student_id resolved after upload via service — use application_id from params
          // We need student_id for folder: retrieve from application in service
          // For now store in temp location keyed by applicationId + docType
          const applicationId = req.params.id;
          const docType = req.body.doc_type || 'misc';
          // student_id not yet known at multer level — use placeholder, service moves file
          // Actually: we store directly, service builds correct URL based on student_id
          const dir = join(
            process.cwd(),
            'uploads',
            'applications',
            applicationId,
            docType,
          );
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const docType = (_req as any).body?.doc_type || 'doc';
          const ext = extname(file.originalname);
          cb(null, `${docType}_${uuid()}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, images, and Word documents allowed'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  async uploadDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('doc_type') docType: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!docType) throw new BadRequestException('doc_type is required');
    return this.applicationsService.uploadDocument(id, req.user.id, file, docType);
  }

  @Delete(':id/documents/:docId')
  async deleteDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('docId', ParseUUIDPipe) docId: string,
    @Request() req: any,
  ) {
    return this.applicationsService.deleteDocument(id, docId, req.user.id);
  }
}
