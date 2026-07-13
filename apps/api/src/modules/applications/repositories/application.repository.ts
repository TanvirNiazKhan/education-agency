import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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

  async findAll(search?: string): Promise<Application[]> {
    let where: FindOptionsWhere<Application>[] | undefined;
    if (search) {
      const q = ILike(`%${search}%`);
      where = [
        { student: { user: { first_name: q } } },
        { student: { user: { last_name: q } } },
        { university: { name: q } },
        { course: { name: q } },
      ];
    }
    return this.applications.find({
      where,
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

  async getDashboardStats() {
    const qb = this.applications.createQueryBuilder('app')
      .leftJoinAndSelect('app.university', 'uni')
      .leftJoinAndSelect('uni.country', 'country');

    const apps = await qb.getMany();

    const totalStudents = new Set(apps.map((a) => a.student_id)).size;
    const totalApplications = apps.length;

    const statusCounts: Record<string, number> = {};
    for (const a of apps) {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    }

    // Applications by country
    const countryMap = new Map<string, number>();
    for (const a of apps) {
      const name = a.university?.country?.name || 'Unknown';
      countryMap.set(name, (countryMap.get(name) || 0) + 1);
    }
    const countryBreakdown = [...countryMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Applications by university
    const uniMap = new Map<string, { name: string; shortName: string | null; count: number }>();
    for (const a of apps) {
      const id = a.university_id;
      if (!uniMap.has(id)) {
        uniMap.set(id, { name: a.university?.name || 'Unknown', shortName: a.university?.short_name || null, count: 0 });
      }
      uniMap.get(id)!.count++;
    }
    const universityBreakdown = [...uniMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Applications by intake month
    const intakeMap = new Map<string, number>();
    for (const a of apps) {
      const key = a.commence_month || 'Unknown';
      intakeMap.set(key, (intakeMap.get(key) || 0) + 1);
    }
    const intakeBreakdown = [...intakeMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalStudents,
      totalApplications,
      statusCounts,
      countryBreakdown,
      universityBreakdown,
      intakeBreakdown,
    };
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
