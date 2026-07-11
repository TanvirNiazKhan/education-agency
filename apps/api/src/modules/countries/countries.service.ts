import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryRepository } from './repositories/country.repository';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.findAll();
  }

  async findById(id: string): Promise<Country> {
    const country = await this.countryRepository.findById(id);
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async findByIdWithRelations(id: string): Promise<Country> {
    const country = await this.countryRepository.findByIdWithRelations(id);
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async create(data: Partial<Country>): Promise<Country> {
    return this.countryRepository.create(data);
  }

  async update(id: string, data: Partial<Country>): Promise<Country | null> {
    await this.findById(id);
    return this.countryRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.countryRepository.delete(id);
  }
}
