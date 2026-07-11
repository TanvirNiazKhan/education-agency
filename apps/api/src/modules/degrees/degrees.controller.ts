import {
  Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DegreesService } from './degrees.service';
import { Degree } from './entities/degree.entity';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@ApiTags('Degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Get()
  async findAll(): Promise<Degree[]> {
    return this.degreesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Degree> {
    return this.degreesService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateDegreeDto): Promise<Degree> {
    return this.degreesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDegreeDto,
  ): Promise<Degree | null> {
    return this.degreesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.degreesService.delete(id);
  }
}
