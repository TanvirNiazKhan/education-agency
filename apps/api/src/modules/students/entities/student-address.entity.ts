import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Student } from './student.entity';

export enum AddressType {
  CURRENT = 'current',
  PERMANENT = 'permanent',
}

@Entity('student_addresses')
export class StudentAddress extends BaseEntity {
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  apt: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  country: string;
}
