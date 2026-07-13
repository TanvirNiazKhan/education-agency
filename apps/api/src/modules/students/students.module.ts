import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@modules/users/users.module';
import { Student } from './entities/student.entity';
import { StudentAddress } from './entities/student-address.entity';
import { StudentEmergencyContact } from './entities/student-emergency-contact.entity';
import { StudentEducation } from './entities/student-education.entity';
import { StudentWorkExperience } from './entities/student-work-experience.entity';
import { StudentRepository } from './repositories/student.repository';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Student,
      StudentAddress,
      StudentEmergencyContact,
      StudentEducation,
      StudentWorkExperience,
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
