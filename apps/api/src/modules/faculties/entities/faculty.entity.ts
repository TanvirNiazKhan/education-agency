import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { University } from '@modules/universities/entities/university.entity';
import { Course } from '@modules/courses/entities/course.entity';

@Entity('faculties')
export class Faculty extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => University, (university) => university.faculties)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ type: 'uuid' })
  university_id: string;

  @OneToMany(() => Course, (course) => course.faculty)
  courses: Course[];
}
