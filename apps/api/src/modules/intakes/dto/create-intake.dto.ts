import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIntakeDto {
  @ApiProperty({ example: 'February 2026' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '2026-02-01' })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({ example: '2025-11-30' })
  @IsString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({ example: 'open', description: 'open | closed | upcoming' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  university_id: string;
}
