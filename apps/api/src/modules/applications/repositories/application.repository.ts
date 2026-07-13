import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from '../entities/application.entity';
import { ApplicationStatusHistory } from '../entities/application-status-history.entity';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
    @InjectRepository(ApplicationStatusHistory)
    private readonly history: Repository<ApplicationStatusHistory>,
  ) {}

  async findByStudentId(studentId: string): Promise<Application[]> {
    return this.applications.find({
      where: { student_id: studentId },
      relations: { university: true, course: true },
      order: { created_at: 'DESC' },
    });
  }

  async findAll(): Promise<Application[]> {
    return this.applications.find({
      relations: {
        university: { country: true },
        course: true,
        student: { user: true },
        documents: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  async findByIdAdmin(id: string): Promise<Application | null> {
    return this.applications.findOne({
      where: { id },
      relations: {
        university: { country: true },
        course: { faculty: true },
        student: {
          user: true,
          addresses: true,
          emergency_contacts: true,
          education: true,
          work_experience: true,
        },
        documents: true,
        status_history: true,
      },
    });
  }

  async updateFields(id: string, data: Partial<Application>): Promise<Application> {
    await this.applications.update(id, data);
    return this.applications.findOne({
      where: { id },
      relations: {
        university: { country: true },
        course: { faculty: true },
        student: { user: true },
        documents: true,
        status_history: true,
      },
    }) as Promise<Application>;
  }

  async changeStatus(
    id: string,
    fromStatus: string,
    toStatus: string,
    comment?: string,
  ): Promise<Application> {
    await this.applications.update(id, { status: toStatus as any });
    const histEntry = this.history.create({
      application_id: id,
      from_status: fromStatus,
      to_status: toStatus,
      comment,
    });
    await this.history.save(histEntry);
    return this.findByIdAdmin(id) as Promise<Application>;
  }

  async findById(id: string): Promise<Application | null> {
    return this.applications.findOne({
      where: { id },
      relations: { university: true, course: true, documents: true, status_history: true },
    });
  }

  async create(data: Partial<Application>): Promise<Application> {
    const entity = this.applications.create({
      ...data,
      submitted_at: new Date(),
    });
    const saved = await this.applications.save(entity);
    // Record initial status history
    const histEntry = this.history.create({
      application_id: saved.id,
      from_status: undefined,
      to_status: ApplicationStatus.SUBMITTED,
    });
    await this.history.save(histEntry);
    return saved;
  }
}
