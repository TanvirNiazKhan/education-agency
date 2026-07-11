import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Country } from '@modules/countries/entities/country.entity';
import { University } from '@modules/universities/entities/university.entity';

@Entity('cities')
export class City extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  state: string;

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'uuid' })
  country_id: string;

  @OneToMany(() => University, (university) => university.city)
  universities: University[];
}
