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
import { memoryStorage } from 'multer';
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
      storage: memoryStorage(),
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
