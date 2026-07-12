import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { University } from '@modules/universities/entities/university.entity';

@Entity('university_images')
export class UniversityImage extends BaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: 0 })
  sort_order: number;

  @ManyToOne(() => University, (university) => university.images)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ type: 'uuid' })
  university_id: string;
}
