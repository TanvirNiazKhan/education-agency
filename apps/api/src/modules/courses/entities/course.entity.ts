import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Faculty } from '@modules/faculties/entities/faculty.entity';
import { Degree } from '@modules/degrees/entities/degree.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  course_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tuition_fee: number;

  @Column()
  currency: string;

  @Column({ type: 'int' })
  duration_months: number;

  @Column({ nullable: true })
  intake: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ielts_requirement: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ielts_speaking: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ielts_writing: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ielts_reading: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  ielts_listening: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  pte_requirement: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  pte_speaking: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  pte_writing: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  pte_reading: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  pte_listening: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  toefl_requirement: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  toefl_speaking: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  toefl_writing: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  toefl_reading: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  toefl_listening: number;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ default: false })
  scholarship_available: boolean;

  @ManyToOne(() => Faculty, (faculty) => faculty.courses)
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column({ type: 'uuid' })
  faculty_id: string;

  @ManyToOne(() => Degree, (degree) => degree.courses)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

  @Column({ type: 'uuid' })
  degree_id: string;
}
