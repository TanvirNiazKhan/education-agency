import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Student } from '@modules/students/entities/student.entity';
import { University } from '@modules/universities/entities/university.entity';
import { Course } from '@modules/courses/entities/course.entity';
import { ApplicationDocument } from './application-document.entity';
import { ApplicationStatusHistory } from './application-status-history.entity';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  DOCUMENTS_REQUESTED = 'documents_requested',
  CONDITIONAL_OFFER = 'conditional_offer',
  UNCONDITIONAL_OFFER = 'unconditional_offer',
  ACCEPTED = 'accepted',
  ENROLLED = 'enrolled',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('applications')
export class Application extends BaseEntity {
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  student_id: string;

  @ManyToOne(() => University)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ type: 'uuid' })
  university_id: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'uuid' })
  course_id: string;

  @Column({ nullable: true })
  campus: string;

  @Column({ nullable: true })
  application_type: string;

  @Column({ nullable: true })
  study_location: string;

  @Column({ nullable: true })
  student_type: string;

  @Column({ nullable: true })
  enrolment_type: string;

  @Column({ nullable: true })
  commence_month: string;

  @Column({ nullable: true })
  commence_year: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
  })
  status: ApplicationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  submitted_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ApplicationDocument, (doc) => doc.application, {
    cascade: true,
  })
  documents: ApplicationDocument[];

  @OneToMany(() => ApplicationStatusHistory, (h) => h.application, {
    cascade: true,
  })
  status_history: ApplicationStatusHistory[];
}
