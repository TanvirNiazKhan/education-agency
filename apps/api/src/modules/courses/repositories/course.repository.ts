import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.repository.find({
      where: { is_active: true },
      relations: { faculty: true, degree: true },
    });
  }

  async findByFacultyId(facultyId: string): Promise<Course[]> {
    return this.repository.find({
      where: { faculty_id: facultyId, is_active: true },
      relations: { degree: true },
    });
  }

  async findWithScholarship(): Promise<Course[]> {
    return this.repository.find({
      where: { scholarship_available: true, is_active: true },
      relations: { faculty: true, degree: true },
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.repository.findOne({
      where: { id },
      relations: { faculty: true, degree: true },
    });
  }

  async create(data: Partial<Course>): Promise<Course> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
