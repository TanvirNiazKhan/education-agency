import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@ApiTags('Faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  async findAll(
    @Query('university_id') universityId?: string,
    @Query('q') search?: string,
    @Query('include_inactive') includeInactive?: string,
  ): Promise<Faculty[]> {
    const inclInactive = includeInactive === 'true';
    if (universityId) return this.facultiesService.findByUniversityId(universityId, search, inclInactive);
    return this.facultiesService.findAll(search, inclInactive);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Faculty> {
    return this.facultiesService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateFacultyDto): Promise<Faculty> {
    return this.facultiesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFacultyDto,
  ): Promise<Faculty | null> {
    return this.facultiesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.facultiesService.delete(id);
  }
}
