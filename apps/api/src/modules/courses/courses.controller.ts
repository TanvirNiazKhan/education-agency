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
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(
    @Query('faculty_id') facultyId?: string,
    @Query('scholarship') scholarship?: string,
    @Query('q') search?: string,
    @Query('include_inactive') includeInactive?: string,
  ): Promise<Course[]> {
    const inclInactive = includeInactive === 'true';
    if (scholarship === 'true') {
      return this.coursesService.findWithScholarship();
    }
    if (facultyId) {
      return this.coursesService.findByFacultyId(facultyId, search, inclInactive);
    }
    return this.coursesService.findAll(search, inclInactive);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCourseDto,
  ): Promise<Course | null> {
    return this.coursesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.delete(id);
  }
}
