import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { StudentsService } from './students.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { UsersService } from '@modules/users/users.service';

@ApiTags('Students')
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.studentsService.getProfile(req.user.id);
  }

  @Put('profile')
  async upsertProfile(@Request() req: any, @Body() dto: UpsertProfileDto) {
    return this.studentsService.upsertProfile(req.user.id, dto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req: any, _file, cb) => {
          const userId = (_req as any).user?.id || 'unknown';
          const dir = join(process.cwd(), 'uploads', 'avatars', userId);
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `avatar_${uuid()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only JPEG, PNG and WebP images allowed'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const avatarUrl = `/uploads/avatars/${req.user.id}/${file.filename}`;
    await this.usersService.update(req.user.id, { avatar_url: avatarUrl });
    return { avatar_url: avatarUrl };
  }
}
