import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({ example: 'passport' })
  @IsString()
  @IsNotEmpty()
  doc_type: string;
}
