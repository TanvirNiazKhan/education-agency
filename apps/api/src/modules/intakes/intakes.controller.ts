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
import { IntakesService } from './intakes.service';
import { Intake } from './entities/intake.entity';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@ApiTags('Intakes')
@Controller('intakes')
export class IntakesController {
  constructor(private readonly intakesService: IntakesService) {}

  @Get()
  async findByUniversityId(
    @Query('university_id', ParseUUIDPipe) universityId: string,
  ): Promise<Intake[]> {
    return this.intakesService.findByUniversityId(universityId);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Intake> {
    return this.intakesService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateIntakeDto): Promise<Intake> {
    return this.intakesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateIntakeDto,
  ): Promise<Intake | null> {
    return this.intakesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.intakesService.delete(id);
  }
}
