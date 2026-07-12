import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scholarship } from '../entities/scholarship.entity';
import { ScholarshipScope } from '../entities/scholarship-scope.entity';

@Injectable()
export class ScholarshipRepository {
  constructor(
    @InjectRepository(Scholarship)
    private readonly repository: Repository<Scholarship>,
    @InjectRepository(ScholarshipScope)
    private readonly scopeRepository: Repository<ScholarshipScope>,
  ) {}

  async findByUniversityId(universityId: string): Promise<Scholarship[]> {
    return this.repository.find({
      where: { university_id: universityId, is_active: true },
      relations: { scopes: true },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Scholarship | null> {
    return this.repository.findOne({
      where: { id },
      relations: { scopes: true, university: true },
    });
  }

  async create(data: Partial<Scholarship>, scopes?: { scope_type: string; scope_id: string }[]): Promise<Scholarship> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    if (scopes && scopes.length > 0) {
      const scopeEntities = scopes.map((s) =>
        this.scopeRepository.create({ ...s, scholarship_id: saved.id }),
      );
      await this.scopeRepository.save(scopeEntities);
    }
    return this.findById(saved.id) as Promise<Scholarship>;
  }

  async update(
    id: string,
    data: Partial<Scholarship>,
    scopes?: { scope_type: string; scope_id: string }[],
  ): Promise<Scholarship | null> {
    await this.repository.update(id, data);
    if (scopes !== undefined) {
      await this.scopeRepository.delete({ scholarship_id: id });
      if (scopes.length > 0) {
        const scopeEntities = scopes.map((s) =>
          this.scopeRepository.create({ ...s, scholarship_id: id }),
        );
        await this.scopeRepository.save(scopeEntities);
      }
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
