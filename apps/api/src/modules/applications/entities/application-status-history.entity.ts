import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Application } from './application.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('application_status_history')
export class ApplicationStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application, (app) => app.status_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'uuid' })
  application_id: string;

  @Column({ nullable: true })
  from_status: string;

  @Column()
  to_status: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
