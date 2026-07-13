import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpsertStudentDto } from './upsert-student.dto';

export class AddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() street?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() state?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() postcode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
}

export class EmergencyContactDto {
  @ApiPropertyOptional() @IsOptional() @IsString() relationship?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() first_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() last_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() other_phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
}

export class EducationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() level?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completion_year?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() english_test_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() english_test_date?: string;
  @ApiPropertyOptional() @IsOptional() score_overall?: number;
  @ApiPropertyOptional() @IsOptional() score_reading?: number;
  @ApiPropertyOptional() @IsOptional() score_listening?: number;
  @ApiPropertyOptional() @IsOptional() score_writing?: number;
  @ApiPropertyOptional() @IsOptional() score_speaking?: number;
}

export class WorkExperienceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manager?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() start_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() end_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() professional_membership?: string;
}

export class UpsertProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpsertStudentDto)
  personal?: UpsertStudentDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  current_address?: AddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  permanent_address?: AddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergency_contact?: EmergencyContactDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => EducationDto)
  education?: EducationDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkExperienceDto)
  work_experience?: WorkExperienceDto;
}
