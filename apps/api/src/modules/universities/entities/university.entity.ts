import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Country } from '@modules/countries/entities/country.entity';
import { City } from '@modules/cities/entities/city.entity';
import { Faculty } from '@modules/faculties/entities/faculty.entity';

@Entity('universities')
export class University extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  university_type: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  featured: boolean;

  @ManyToOne(() => Country, (country) => country.universities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'uuid' })
  country_id: string;

  @ManyToOne(() => City, (city) => city.universities)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ type: 'uuid' })
  city_id: string;

  @OneToMany(() => Faculty, (faculty) => faculty.university)
  faculties: Faculty[];
}
