import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from './repositories/university.repository';
import { University } from './entities/university.entity';

@Injectable()
export class UniversitiesService {
  constructor(
    private readonly universityRepository: UniversityRepository,
  ) {}

  async findAll(): Promise<University[]> {
    return this.universityRepository.findAll();
  }

  async findFeatured(): Promise<University[]> {
    return this.universityRepository.findFeatured();
  }

  async findByCountryId(countryId: string): Promise<University[]> {
    return this.universityRepository.findByCountryId(countryId);
  }

  async findById(id: string): Promise<University> {
    const university = await this.universityRepository.findById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async findBySlug(slug: string): Promise<University> {
    const university = await this.universityRepository.findBySlug(slug);
    if (!university) {
      throw new NotFoundException(`University with slug "${slug}" not found`);
    }
    return university;
  }

  async create(data: Partial<University>): Promise<University> {
    return this.universityRepository.create(data);
  }

  async update(id: string, data: Partial<University>): Promise<University | null> {
    await this.findById(id);
    return this.universityRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.universityRepository.delete(id);
  }
}
