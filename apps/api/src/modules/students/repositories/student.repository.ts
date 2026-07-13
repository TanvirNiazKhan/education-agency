import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { StudentAddress, AddressType } from '../entities/student-address.entity';
import { StudentEmergencyContact } from '../entities/student-emergency-contact.entity';
import { StudentEducation } from '../entities/student-education.entity';
import { StudentWorkExperience } from '../entities/student-work-experience.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private readonly students: Repository<Student>,
    @InjectRepository(StudentAddress)
    private readonly addresses: Repository<StudentAddress>,
    @InjectRepository(StudentEmergencyContact)
    private readonly emergencyContacts: Repository<StudentEmergencyContact>,
    @InjectRepository(StudentEducation)
    private readonly education: Repository<StudentEducation>,
    @InjectRepository(StudentWorkExperience)
    private readonly workExperience: Repository<StudentWorkExperience>,
  ) {}

  async findByUserId(userId: string): Promise<Student | null> {
    return this.students.findOne({ where: { user_id: userId } });
  }

  async findByUserIdWithRelations(userId: string) {
    return this.students.findOne({
      where: { user_id: userId },
      relations: { addresses: true, emergency_contacts: true, education: true, work_experience: true },
    });
  }

  async upsertStudent(userId: string, data: Partial<Student>): Promise<Student> {
    let student = await this.findByUserId(userId);
    if (student) {
      await this.students.update(student.id, data);
      return this.students.findOne({ where: { id: student.id } }) as Promise<Student>;
    }
    const entity = this.students.create({ ...data, user_id: userId });
    return this.students.save(entity);
  }

  async upsertAddress(studentId: string, type: AddressType, data: Partial<StudentAddress>) {
    let address = await this.addresses.findOne({ where: { student_id: studentId, type } });
    if (address) {
      await this.addresses.update(address.id, data);
      return this.addresses.findOne({ where: { id: address.id } });
    }
    const entity = this.addresses.create({ ...data, student_id: studentId, type });
    return this.addresses.save(entity);
  }

  async upsertEmergencyContact(studentId: string, data: Partial<StudentEmergencyContact>) {
    let contact = await this.emergencyContacts.findOne({ where: { student_id: studentId } });
    if (contact) {
      await this.emergencyContacts.update(contact.id, data);
      return this.emergencyContacts.findOne({ where: { id: contact.id } });
    }
    const entity = this.emergencyContacts.create({ ...data, student_id: studentId });
    return this.emergencyContacts.save(entity);
  }

  async upsertEducation(studentId: string, data: Partial<StudentEducation>) {
    let edu = await this.education.findOne({ where: { student_id: studentId } });
    if (edu) {
      await this.education.update(edu.id, data);
      return this.education.findOne({ where: { id: edu.id } });
    }
    const entity = this.education.create({ ...data, student_id: studentId });
    return this.education.save(entity);
  }

  async upsertWorkExperience(studentId: string, data: Partial<StudentWorkExperience>) {
    let work = await this.workExperience.findOne({ where: { student_id: studentId } });
    if (work) {
      await this.workExperience.update(work.id, data);
      return this.workExperience.findOne({ where: { id: work.id } });
    }
    const entity = this.workExperience.create({ ...data, student_id: studentId });
    return this.workExperience.save(entity);
  }
}
