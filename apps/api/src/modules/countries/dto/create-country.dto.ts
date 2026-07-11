import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Australia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'AUS', maxLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  iso_code: string;

  @ApiPropertyOptional({ example: 'AUD' })
  @IsString()
  @IsOptional()
  currency?: string;
}
