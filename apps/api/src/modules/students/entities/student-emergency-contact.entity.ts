import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Student } from './student.entity';

@Entity('student_emergency_contacts')
export class StudentEmergencyContact extends BaseEntity {
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ nullable: true })
  relationship: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  other_phone: string;

  @Column({ nullable: true })
  email: string;
}
