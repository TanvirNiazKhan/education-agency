import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(City)
    private readonly repository: Repository<City>,
  ) {}

  async findAll(search?: string): Promise<City[]> {
    return this.repository.find({
      where: {
        is_active: true,
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { country: true },
    });
  }

  async findByCountryId(countryId: string, search?: string): Promise<City[]> {
    return this.repository.find({
      where: {
        country_id: countryId,
        is_active: true,
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { country: true },
    });
  }

  async findById(id: string): Promise<City | null> {
    return this.repository.findOne({ where: { id }, relations: { country: true } });
  }

  async create(data: Partial<City>): Promise<City> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<City>): Promise<City | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
