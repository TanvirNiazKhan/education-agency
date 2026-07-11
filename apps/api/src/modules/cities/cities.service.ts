import { Injectable, NotFoundException } from '@nestjs/common';
import { CityRepository } from './repositories/city.repository';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(private readonly cityRepository: CityRepository) {}

  async findAll(): Promise<City[]> {
    return this.cityRepository.findAll();
  }

  async findByCountryId(countryId: string): Promise<City[]> {
    return this.cityRepository.findByCountryId(countryId);
  }

  async findById(id: string): Promise<City> {
    const city = await this.cityRepository.findById(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  async create(data: Partial<City>): Promise<City> {
    return this.cityRepository.create(data);
  }

  async update(id: string, data: Partial<City>): Promise<City | null> {
    await this.findById(id);
    return this.cityRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.cityRepository.delete(id);
  }
}
