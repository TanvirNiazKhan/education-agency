import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { University } from '@modules/universities/entities/university.entity';
import { ScholarshipScope } from './scholarship-scope.entity';

@Entity('scholarships')
export class Scholarship extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'date', nullable: true })
  deadline: string;

  @ManyToOne(() => University, (university) => university.scholarships)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ type: 'uuid' })
  university_id: string;

  @OneToMany(() => ScholarshipScope, (scope) => scope.scholarship, { cascade: true, eager: true })
  scopes: ScholarshipScope[];
}
