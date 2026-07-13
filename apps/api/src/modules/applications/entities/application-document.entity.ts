import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Application } from './application.entity';

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('application_documents')
export class ApplicationDocument extends BaseEntity {
  @ManyToOne(() => Application, (app) => app.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'uuid' })
  application_id: string;

  @Column()
  document_type: string;

  @Column()
  file_name: string;

  @Column()
  file_url: string;

  @Column({ nullable: true })
  file_size: number;

  @Column({ nullable: true })
  mime_type: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date;
}
