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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScholarshipsService } from './scholarships.service';
import { Scholarship } from './entities/scholarship.entity';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';

@ApiTags('Scholarships')
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Get()
  async findByUniversityId(
    @Query('university_id', ParseUUIDPipe) universityId: string,
  ): Promise<Scholarship[]> {
    return this.scholarshipsService.findByUniversityId(universityId);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Scholarship> {
    return this.scholarshipsService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateScholarshipDto): Promise<Scholarship> {
    return this.scholarshipsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateScholarshipDto,
  ): Promise<Scholarship | null> {
    return this.scholarshipsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.scholarshipsService.delete(id);
  }
}
