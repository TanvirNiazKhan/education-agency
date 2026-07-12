import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUniversityImageDto {
  @ApiProperty({ example: 'https://example.com/campus.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Campus aerial view' })
  @IsString()
  @IsOptional()
  alt_text?: string;

  @ApiPropertyOptional({ example: 'campus' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  sort_order?: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  university_id: string;
}
