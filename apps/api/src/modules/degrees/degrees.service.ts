import { Injectable, NotFoundException } from '@nestjs/common';
import { DegreeRepository } from './repositories/degree.repository';
import { Degree } from './entities/degree.entity';

@Injectable()
export class DegreesService {
  constructor(private readonly degreeRepository: DegreeRepository) {}

  async findAll(): Promise<Degree[]> {
    return this.degreeRepository.findAll();
  }

  async findById(id: string): Promise<Degree> {
    const degree = await this.degreeRepository.findById(id);
    if (!degree) throw new NotFoundException(`Degree with ID ${id} not found`);
    return degree;
  }

  async create(data: Partial<Degree>): Promise<Degree> {
    return this.degreeRepository.create(data);
  }

  async update(id: string, data: Partial<Degree>): Promise<Degree | null> {
    await this.findById(id);
    return this.degreeRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.degreeRepository.delete(id);
  }
}
