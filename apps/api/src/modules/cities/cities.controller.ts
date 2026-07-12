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
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll(
    @Query('country_id') countryId?: string,
    @Query('q') search?: string,
  ): Promise<City[]> {
    if (countryId) {
      return this.citiesService.findByCountryId(countryId, search);
    }
    return this.citiesService.findAll(search);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<City> {
    return this.citiesService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateCityDto): Promise<City> {
    return this.citiesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCityDto,
  ): Promise<City | null> {
    return this.citiesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.citiesService.delete(id);
  }
}
