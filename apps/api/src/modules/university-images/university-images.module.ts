import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityImage } from './entities/university-image.entity';
import { UniversityImageRepository } from './repositories/university-image.repository';
import { UniversityImagesService } from './university-images.service';
import { UniversityImagesController } from './university-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityImage])],
  controllers: [UniversityImagesController],
  providers: [UniversityImagesService, UniversityImageRepository],
  exports: [UniversityImagesService, UniversityImageRepository],
})
export class UniversityImagesModule {}
