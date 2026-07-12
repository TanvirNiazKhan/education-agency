import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Scholarship } from './scholarship.entity';

@Entity('scholarship_scopes')
export class ScholarshipScope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scope_type: string;

  @Column({ type: 'uuid' })
  scope_id: string;

  @ManyToOne(() => Scholarship, (scholarship) => scholarship.scopes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scholarship_id' })
  scholarship: Scholarship;

  @Column({ type: 'uuid' })
  scholarship_id: string;

  @CreateDateColumn()
  created_at: Date;
}
