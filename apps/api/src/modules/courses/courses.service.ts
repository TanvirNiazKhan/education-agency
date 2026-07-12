import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async findAll(search?: string, includeInactive = false): Promise<Course[]> {
    return this.courseRepository.findAll(search, includeInactive);
  }

  async findByFacultyId(facultyId: string, search?: string, includeInactive = false): Promise<Course[]> {
    return this.courseRepository.findByFacultyId(facultyId, search, includeInactive);
  }

  async findWithScholarship(): Promise<Course[]> {
    return this.courseRepository.findWithScholarship();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async create(data: Partial<Course>): Promise<Course> {
    return this.courseRepository.create(data);
  }

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    await this.findById(id);
    return this.courseRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.courseRepository.delete(id);
  }
}
