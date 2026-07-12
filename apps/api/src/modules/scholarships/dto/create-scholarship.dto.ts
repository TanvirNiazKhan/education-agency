import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScopeDto {
  @ApiProperty({ example: 'course', description: 'course | faculty | degree' })
  @IsString()
  @IsNotEmpty()
  scope_type: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  scope_id: string;
}

export class CreateScholarshipDto {
  @ApiProperty({ example: 'Engineering Excellence Award' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Awarded to top-performing engineering students...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 25, description: 'Scholarship percentage (e.g. 25 for 25%)' })
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @ApiPropertyOptional({ example: 'partial', description: 'full | partial | tuition-waiver' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  university_id: string;

  @ApiPropertyOptional({ type: [ScopeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScopeDto)
  @IsOptional()
  scopes?: ScopeDto[];
}
