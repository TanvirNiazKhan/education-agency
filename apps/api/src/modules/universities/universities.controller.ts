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
import { UniversitiesService } from './universities.service';
import { University } from './entities/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  async findAll(
    @Query('country_id') countryId?: string,
    @Query('featured') featured?: string,
    @Query('q') search?: string,
    @Query('include_inactive') includeInactive?: string,
  ): Promise<University[]> {
    if (featured === 'true') {
      return this.universitiesService.findFeatured();
    }
    if (countryId) {
      return this.universitiesService.findByCountryId(countryId, search);
    }
    return this.universitiesService.findAll(search, includeInactive === 'true');
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<University> {
    return this.universitiesService.findById(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<University> {
    return this.universitiesService.findBySlug(slug);
  }

  @Post()
  async create(@Body() data: CreateUniversityDto): Promise<University> {
    return this.universitiesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUniversityDto,
  ): Promise<University | null> {
    return this.universitiesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.universitiesService.delete(id);
  }
}
