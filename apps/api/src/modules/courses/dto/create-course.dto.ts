import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Software Engineering' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty({ example: 35000.0 })
  @IsNumber()
  tuition_fee: number;

  @ApiProperty({ example: 'AUD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 24 })
  @IsInt()
  duration_months: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  faculty_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  degree_id: string;

  @ApiPropertyOptional({ example: 'February, July' })
  @IsString()
  @IsOptional()
  intake?: string;

  @ApiPropertyOptional({ example: 6.5 })
  @IsNumber()
  @IsOptional()
  ielts_requirement?: number;

  @ApiPropertyOptional({ example: 58.0 })
  @IsNumber()
  @IsOptional()
  pte_requirement?: number;

  @ApiPropertyOptional({ example: 79.0 })
  @IsNumber()
  @IsOptional()
  toefl_requirement?: number;

  @ApiPropertyOptional({ example: 'This course covers...' })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  scholarship_available?: boolean;
}
