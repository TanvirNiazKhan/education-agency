import { PartialType } from '@nestjs/swagger';
import { CreateUniversityImageDto } from './create-university-image.dto';

export class UpdateUniversityImageDto extends PartialType(CreateUniversityImageDto) {}
