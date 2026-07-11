import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDegreeDto {
  @ApiProperty({ example: 'Bachelor' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
