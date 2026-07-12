import { Injectable, NotFoundException } from '@nestjs/common';
import { IntakeRepository } from './repositories/intake.repository';
import { Intake } from './entities/intake.entity';

@Injectable()
export class IntakesService {
  constructor(
    private readonly intakeRepository: IntakeRepository,
  ) {}

  async findByUniversityId(universityId: string): Promise<Intake[]> {
    return this.intakeRepository.findByUniversityId(universityId);
  }

  async findById(id: string): Promise<Intake> {
    const intake = await this.intakeRepository.findById(id);
    if (!intake) {
      throw new NotFoundException(`Intake with ID ${id} not found`);
    }
    return intake;
  }

  async create(data: Partial<Intake>): Promise<Intake> {
    return this.intakeRepository.create(data);
  }

  async update(id: string, data: Partial<Intake>): Promise<Intake | null> {
    await this.findById(id);
    return this.intakeRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.intakeRepository.delete(id);
  }
}
