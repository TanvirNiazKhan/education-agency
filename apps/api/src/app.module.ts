import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { databaseConfig, redisConfig, mailConfig } from './config';
import { DatabaseModule } from './database/database.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { CoursesModule } from './modules/courses/courses.module';
import { UniversityImagesModule } from './modules/university-images/university-images.module';
import { ScholarshipsModule } from './modules/scholarships/scholarships.module';
import { IntakesModule } from './modules/intakes/intakes.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { ApplicationsModule } from './modules/applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, mailConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    ApplicationsModule,
    CountriesModule,
    CitiesModule,
    UniversitiesModule,
    DegreesModule,
    FacultiesModule,
    CoursesModule,
    UniversityImagesModule,
    ScholarshipsModule,
    IntakesModule,
  ],
})
export class AppModule {}
