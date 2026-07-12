import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intake } from '../entities/intake.entity';

@Injectable()
export class IntakeRepository {
  constructor(
    @InjectRepository(Intake)
    private readonly repository: Repository<Intake>,
  ) {}

  async findByUniversityId(universityId: string): Promise<Intake[]> {
    return this.repository.find({
      where: { university_id: universityId, is_active: true },
      order: { start_date: 'ASC' },
    });
  }

  async findById(id: string): Promise<Intake | null> {
    return this.repository.findOne({
      where: { id },
      relations: { university: true },
    });
  }

  async create(data: Partial<Intake>): Promise<Intake> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Intake>): Promise<Intake | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
