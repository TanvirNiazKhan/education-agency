import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  avatar_url: string;
}
