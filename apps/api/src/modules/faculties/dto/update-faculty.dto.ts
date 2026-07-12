import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateFacultyDto } from './create-faculty.dto';

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
