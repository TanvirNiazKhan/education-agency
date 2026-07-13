import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertStudentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() date_of_birth?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() marital_status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() home_phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() skype?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nationality?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passport_no?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passport_issue_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passport_expiry_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passport_issue_place?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passport_birth_place?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() visa_refused?: boolean;
}
