import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Faculty } from '../entities/faculty.entity';

@Injectable()
export class FacultyRepository {
  constructor(
    @InjectRepository(Faculty)
    private readonly repository: Repository<Faculty>,
  ) {}

  async findAll(search?: string, includeInactive = false): Promise<Faculty[]> {
    return this.repository.find({
      where: {
        ...(!includeInactive && { is_active: true }),
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { university: true },
    });
  }

  async findByUniversityId(universityId: string, search?: string, includeInactive = false): Promise<Faculty[]> {
    return this.repository.find({
      where: {
        university_id: universityId,
        ...(!includeInactive && { is_active: true }),
        ...(search && { name: ILike(`%${search}%`) }),
      },
      relations: { university: true },
    });
  }

  async findById(id: string): Promise<Faculty | null> {
    return this.repository.findOne({
      where: { id },
      relations: { university: true, courses: true },
    });
  }

  async create(data: Partial<Faculty>): Promise<Faculty> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Faculty>): Promise<Faculty | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
