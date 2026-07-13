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
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationAdminDto, ChangeStatusDto } from './dto/update-application.dto';
import { ApplicationDocument } from './entities/application-document.entity';

@ApiTags('Admin Applications')
@Controller('admin/applications')
export class AdminApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
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

    const filePath = join(process.cwd(), doc.file_url);
    if (!existsSync(filePath)) throw new NotFoundException('File not found on disk');

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.file_name)}"`);
    res.setHeader('Content-Type', doc.mime_type || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');

    createReadStream(filePath).pipe(res);
  }
}
