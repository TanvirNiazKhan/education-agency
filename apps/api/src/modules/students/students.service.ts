import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRepository } from './repositories/student.repository';
import { AddressType } from './entities/student-address.entity';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getProfile(userId: string) {
    return this.studentRepository.findByUserIdWithRelations(userId);
  }

  async upsertProfile(userId: string, dto: UpsertProfileDto) {
    // 1. Upsert core student record
    let student = await this.studentRepository.upsertStudent(userId, dto.personal || {});

    // 2. Current address
    if (dto.current_address) {
      await this.studentRepository.upsertAddress(student.id, AddressType.CURRENT, dto.current_address);
    }

    // 3. Permanent address
    if (dto.permanent_address) {
      await this.studentRepository.upsertAddress(student.id, AddressType.PERMANENT, dto.permanent_address);
    }

    // 4. Emergency contact
    if (dto.emergency_contact) {
      await this.studentRepository.upsertEmergencyContact(student.id, dto.emergency_contact);
    }

    // 5. Education
    if (dto.education) {
      await this.studentRepository.upsertEducation(student.id, dto.education);
    }

    // 6. Work experience
    if (dto.work_experience) {
      await this.studentRepository.upsertWorkExperience(student.id, dto.work_experience);
    }

    return this.studentRepository.findByUserIdWithRelations(userId);
  }

  async getOrCreateStudent(userId: string) {
    let student = await this.studentRepository.findByUserId(userId);
    if (!student) {
      student = await this.studentRepository.upsertStudent(userId, {});
    }
    return student;
  }
}
