import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../entities/application.entity';

export class UpdateApplicationAdminDto {
  @ApiPropertyOptional() @IsOptional() @IsString() campus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() application_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() study_location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() student_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enrolment_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commence_month?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commence_year?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class ChangeStatusDto {
  @ApiPropertyOptional() @IsEnum(ApplicationStatus) status: ApplicationStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
