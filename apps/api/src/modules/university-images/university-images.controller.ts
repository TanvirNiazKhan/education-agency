import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { UniversityImagesService } from './university-images.service';
import { UniversityImage } from './entities/university-image.entity';
import { UpdateUniversityImageDto } from './dto/update-university-image.dto';

const uploadDir = join(process.cwd(), 'uploads', 'university-images');

const storage = diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@ApiTags('University Images')
@Controller('university-images')
export class UniversityImagesController {
  constructor(private readonly universityImagesService: UniversityImagesService) {}

  @Get()
  async findByUniversityId(
    @Query('university_id', ParseUUIDPipe) universityId: string,
  ): Promise<UniversityImage[]> {
    return this.universityImagesService.findByUniversityId(universityId);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UniversityImage> {
    return this.universityImagesService.findById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        university_id: { type: 'string', format: 'uuid' },
        type: { type: 'string', example: 'campus' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('university_id') universityId: string,
    @Body('type') type?: string,
  ): Promise<UniversityImage[]> {
    return this.universityImagesService.createFromFiles(files, universityId, type);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUniversityImageDto,
  ): Promise<UniversityImage | null> {
    return this.universityImagesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.universityImagesService.delete(id);
  }
}
