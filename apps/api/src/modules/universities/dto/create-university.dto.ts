import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty({ example: 'University of Sydney' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'USYD' })
  @IsString()
  @IsOptional()
  short_name?: string;

  @ApiProperty({ example: 'university-of-sydney' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Public' })
  @IsString()
  @IsOptional()
  university_type?: string;

  @ApiPropertyOptional({ example: 'https://www.sydney.edu.au' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'info@sydney.edu.au' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+61 2 9351 2222' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Camperdown NSW 2006' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '2006' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.png' })
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiPropertyOptional({ example: 'A leading research university...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  country_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  city_id: string;
}
