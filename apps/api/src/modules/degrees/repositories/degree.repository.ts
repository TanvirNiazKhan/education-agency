import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Degree } from '../entities/degree.entity';

@Injectable()
export class DegreeRepository {
  constructor(
    @InjectRepository(Degree)
    private readonly repository: Repository<Degree>,
  ) {}

  async findAll(): Promise<Degree[]> {
    return this.repository.find({ where: { is_active: true } });
  }

  async findById(id: string): Promise<Degree | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Degree>): Promise<Degree> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Degree>): Promise<Degree | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
