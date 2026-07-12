import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUniversityDto } from './create-university.dto';

export class UpdateUniversityDto extends PartialType(CreateUniversityDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
