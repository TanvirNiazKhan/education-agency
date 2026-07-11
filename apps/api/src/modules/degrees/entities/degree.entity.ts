import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Course } from '@modules/courses/entities/course.entity';

@Entity('degrees')
export class Degree extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Course, (course) => course.degree)
  courses: Course[];
}
