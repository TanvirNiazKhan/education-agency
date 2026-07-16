import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@ApiTags('Admin Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createAdmin(@Body() dto: CreateAdminDto) {
    const existing = await this.usersService.findByEmail(
      dto.email.toLowerCase(),
    );
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const { password, ...result } = user;
    return result;
  }

  @Get()
  async listAdmins() {
    const admins = await this.usersService.findAllAdmins();
    return admins.map(({ password, ...rest }) => rest);
  }

  @Patch(':id/activate')
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    const target = await this.usersService.findById(id);
    if (target.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot modify super admin');
    }
    const user = await this.usersService.activate(id);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    const target = await this.usersService.findById(id);
    if (target.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot modify super admin');
    }
    const user = await this.usersService.deactivate(id);
    const { password, ...result } = user;
    return result;
  }
}
