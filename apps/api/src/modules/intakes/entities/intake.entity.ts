import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { University } from '@modules/universities/entities/university.entity';

@Entity('intakes')
export class Intake extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ type: 'date', nullable: true })
  deadline: string;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => University, (university) => university.intakes)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ type: 'uuid' })
  university_id: string;
}
