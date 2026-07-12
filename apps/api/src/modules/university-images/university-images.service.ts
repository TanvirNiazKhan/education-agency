import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityImageRepository } from './repositories/university-image.repository';
import { UniversityImage } from './entities/university-image.entity';

@Injectable()
export class UniversityImagesService {
  constructor(
    private readonly universityImageRepository: UniversityImageRepository,
  ) {}

  async findByUniversityId(universityId: string): Promise<UniversityImage[]> {
    return this.universityImageRepository.findByUniversityId(universityId);
  }

  async findById(id: string): Promise<UniversityImage> {
    const image = await this.universityImageRepository.findById(id);
    if (!image) {
      throw new NotFoundException(`University image with ID ${id} not found`);
    }
    return image;
  }

  async createFromFiles(
    files: Express.Multer.File[],
    universityId: string,
    type?: string,
  ): Promise<UniversityImage[]> {
    const images: UniversityImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const image = await this.universityImageRepository.create({
        url: `/uploads/university-images/${files[i].filename}`,
        alt_text: files[i].originalname,
        type: type || undefined,
        sort_order: i,
        university_id: universityId,
      });
      images.push(image);
    }
    return images;
  }

  async update(id: string, data: Partial<UniversityImage>): Promise<UniversityImage | null> {
    await this.findById(id);
    return this.universityImageRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.universityImageRepository.delete(id);
  }
}
