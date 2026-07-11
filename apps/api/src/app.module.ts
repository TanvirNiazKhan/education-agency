import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, redisConfig, mailConfig } from './config';
import { DatabaseModule } from './database/database.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, mailConfig],
    }),
    DatabaseModule,
    CountriesModule,
    CitiesModule,
    UniversitiesModule,
    DegreesModule,
    FacultiesModule,
    CoursesModule,
  ],
})
export class AppModule {}
