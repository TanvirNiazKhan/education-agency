import { Injectable, NotFoundException } from '@nestjs/common';
import { ScholarshipRepository } from './repositories/scholarship.repository';
import { Scholarship } from './entities/scholarship.entity';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';

@Injectable()
export class ScholarshipsService {
  constructor(
    private readonly scholarshipRepository: ScholarshipRepository,
  ) {}

  async findByUniversityId(universityId: string): Promise<Scholarship[]> {
    return this.scholarshipRepository.findByUniversityId(universityId);
  }

  async findById(id: string): Promise<Scholarship> {
    const scholarship = await this.scholarshipRepository.findById(id);
    if (!scholarship) {
      throw new NotFoundException(`Scholarship with ID ${id} not found`);
    }
    return scholarship;
  }

  async create(dto: CreateScholarshipDto): Promise<Scholarship> {
    const { scopes, ...data } = dto;
    return this.scholarshipRepository.create(data, scopes);
  }

  async update(id: string, dto: UpdateScholarshipDto): Promise<Scholarship | null> {
    await this.findById(id);
    const { scopes, ...data } = dto;
    return this.scholarshipRepository.update(id, data, scopes);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.scholarshipRepository.delete(id);
  }
}
