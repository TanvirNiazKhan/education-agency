import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Student } from './student.entity';

@Entity('student_education')
export class StudentEducation extends BaseEntity {
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  completion_year: string;

  @Column({ nullable: true })
  english_test_type: string;

  @Column({ type: 'date', nullable: true })
  english_test_date: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score_overall: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score_reading: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score_listening: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score_writing: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score_speaking: number;
}
