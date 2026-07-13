import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { StudentAddress } from './student-address.entity';
import { StudentEmergencyContact } from './student-emergency-contact.entity';
import { StudentEducation } from './student-education.entity';
import { StudentWorkExperience } from './student-work-experience.entity';

@Entity('students')
export class Student extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  // Personal
  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: string;

  @Column({ nullable: true })
  marital_status: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  home_phone: string;

  @Column({ nullable: true })
  skype: string;

  // Passport
  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  passport_no: string;

  @Column({ type: 'date', nullable: true })
  passport_issue_date: string;

  @Column({ type: 'date', nullable: true })
  passport_expiry_date: string;

  @Column({ nullable: true })
  passport_issue_place: string;

  @Column({ nullable: true })
  passport_birth_place: string;

  @Column({ default: false })
  visa_refused: boolean;

  @OneToMany(() => StudentAddress, (a) => a.student)
  addresses: StudentAddress[];

  @OneToMany(() => StudentEmergencyContact, (c) => c.student)
  emergency_contacts: StudentEmergencyContact[];

  @OneToMany(() => StudentEducation, (e) => e.student)
  education: StudentEducation[];

  @OneToMany(() => StudentWorkExperience, (w) => w.student)
  work_experience: StudentWorkExperience[];
}
