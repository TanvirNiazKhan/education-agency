import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { City } from '@modules/cities/entities/city.entity';
import { University } from '@modules/universities/entities/university.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @Column()
  name: string;

  @Column({ length: 3, unique: true })
  iso_code: string;

  @Column({ nullable: true })
  currency: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];

  @OneToMany(() => University, (university) => university.country)
  universities: University[];
}
