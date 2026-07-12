import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intake } from './entities/intake.entity';
import { IntakeRepository } from './repositories/intake.repository';
import { IntakesService } from './intakes.service';
import { IntakesController } from './intakes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Intake])],
  controllers: [IntakesController],
  providers: [IntakesService, IntakeRepository],
  exports: [IntakesService, IntakeRepository],
})
export class IntakesModule {}
