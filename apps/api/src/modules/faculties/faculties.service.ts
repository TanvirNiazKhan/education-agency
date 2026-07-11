import { Injectable, NotFoundException } from '@nestjs/common';
import { FacultyRepository } from './repositories/faculty.repository';
import { Faculty } from './entities/faculty.entity';

@Injectable()
export class FacultiesService {
  constructor(private readonly facultyRepository: FacultyRepository) {}

  async findAll(): Promise<Faculty[]> {
    return this.facultyRepository.findAll();
  }

  async findByUniversityId(universityId: string): Promise<Faculty[]> {
    return this.facultyRepository.findByUniversityId(universityId);
  }

  async findById(id: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findById(id);
    if (!faculty) throw new NotFoundException(`Faculty with ID ${id} not found`);
    return faculty;
  }

  async create(data: Partial<Faculty>): Promise<Faculty> {
    return this.facultyRepository.create(data);
  }

  async update(id: string, data: Partial<Faculty>): Promise<Faculty | null> {
    await this.findById(id);
    return this.facultyRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.facultyRepository.delete(id);
  }
}
