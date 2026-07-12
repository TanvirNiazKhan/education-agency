import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { University } from '../entities/university.entity';

@Injectable()
export class UniversityRepository {
  constructor(
    @InjectRepository(University)
    private readonly repository: Repository<University>,
  ) {}

  async findAll(search?: string, includeInactive = false): Promise<University[]> {
    return this.repository.find({
      where: {
        ...(!includeInactive && { is_active: true }),
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { country: true, city: true },
    });
  }

  async findFeatured(): Promise<University[]> {
    return this.repository.find({
      where: { featured: true, is_active: true },
      relations: { country: true, city: true },
    });
  }

  async findByCountryId(countryId: string, search?: string): Promise<University[]> {
    return this.repository.find({
      where: {
        country_id: countryId,
        is_active: true,
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { country: true, city: true },
    });
  }

  async findById(id: string): Promise<University | null> {
    return this.repository.findOne({
      where: { id },
      relations: { country: true, city: true, faculties: true },
    });
  }

  async findBySlug(slug: string): Promise<University | null> {
    return this.repository.findOne({
      where: { slug },
      relations: { country: true, city: true, faculties: true },
    });
  }

  async create(data: Partial<University>): Promise<University> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<University>): Promise<University | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
