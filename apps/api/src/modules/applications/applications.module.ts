import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationDocument } from './entities/application-document.entity';
import { ApplicationStatusHistory } from './entities/application-status-history.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
import { StudentsModule } from '@modules/students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationDocument, ApplicationStatusHistory]),
    StudentsModule,
  ],
  controllers: [ApplicationsController, AdminApplicationsController],
  providers: [ApplicationsService, ApplicationRepository],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
