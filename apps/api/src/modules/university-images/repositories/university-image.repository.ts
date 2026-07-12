import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversityImage } from '../entities/university-image.entity';

@Injectable()
export class UniversityImageRepository {
  constructor(
    @InjectRepository(UniversityImage)
    private readonly repository: Repository<UniversityImage>,
  ) {}

  async findByUniversityId(universityId: string): Promise<UniversityImage[]> {
    return this.repository.find({
      where: { university_id: universityId, is_active: true },
      order: { sort_order: 'ASC' },
    });
  }

  async findById(id: string): Promise<UniversityImage | null> {
    return this.repository.findOne({
      where: { id },
      relations: { university: true },
    });
  }

  async create(data: Partial<UniversityImage>): Promise<UniversityImage> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<UniversityImage>): Promise<UniversityImage | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
}
