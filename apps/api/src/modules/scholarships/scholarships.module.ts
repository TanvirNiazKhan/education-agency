import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipScope } from './entities/scholarship-scope.entity';
import { ScholarshipRepository } from './repositories/scholarship.repository';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scholarship, ScholarshipScope])],
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService, ScholarshipRepository],
  exports: [ScholarshipsService, ScholarshipRepository],
})
export class ScholarshipsModule {}
