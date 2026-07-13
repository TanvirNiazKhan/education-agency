import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Student } from './student.entity';

@Entity('student_work_experience')
export class StudentWorkExperience extends BaseEntity {
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ nullable: true })
  employer: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ nullable: true })
  professional_membership: string;
}
