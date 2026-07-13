import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() university_id: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() course_id: string;
  @ApiPropertyOptional() @IsOptional() @IsString() campus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() application_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() study_location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() student_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enrolment_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commence_month?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commence_year?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
