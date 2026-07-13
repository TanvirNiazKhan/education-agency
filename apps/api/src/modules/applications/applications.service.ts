import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink, rename, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { ApplicationRepository } from './repositories/application.repository';
import { StudentsService } from '@modules/students/students.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationAdminDto, ChangeStatusDto } from './dto/update-application.dto';
import { ApplicationDocument } from './entities/application-document.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly studentsService: StudentsService,
    @InjectRepository(ApplicationDocument)
    private readonly documentRepo: Repository<ApplicationDocument>,
  ) {}

  async getMyApplications(userId: string) {
    const student = await this.studentsService.getOrCreateStudent(userId);
    return this.applicationRepository.findByStudentId(student.id);
  }

  async getById(id: string, userId: string) {
    const application = await this.applicationRepository.findById(id);
    if (!application) throw new NotFoundException('Application not found');
    const student = await this.studentsService.getOrCreateStudent(userId);
    if (application.student_id !== student.id) throw new ForbiddenException();
    return application;
  }

  async create(userId: string, dto: CreateApplicationDto) {
    const student = await this.studentsService.getOrCreateStudent(userId);
    return this.applicationRepository.create({
      student_id: student.id,
      university_id: dto.university_id,
      course_id: dto.course_id,
      campus: dto.campus,
      application_type: dto.application_type,
      study_location: dto.study_location,
      student_type: dto.student_type,
      enrolment_type: dto.enrolment_type,
      commence_month: dto.commence_month,
      commence_year: dto.commence_year,
      notes: dto.notes,
    });
  }

  async uploadDocument(
    applicationId: string,
    userId: string,
    file: Express.Multer.File,
    docType: string,
  ): Promise<ApplicationDocument> {
    const application = await this.getById(applicationId, userId);
    const studentId = application.student_id;

    // Move file from temp location to student-scoped folder
    const finalDir = join(
      process.cwd(),
      'uploads',
      'students',
      studentId,
      'applications',
      applicationId,
      docType,
    );
    await mkdir(finalDir, { recursive: true });

    const finalPath = join(finalDir, file.filename);
    await rename(file.path, finalPath);

    const fileUrl = `/uploads/students/${studentId}/applications/${applicationId}/${docType}/${file.filename}`;

    const doc = this.documentRepo.create({
      application_id: applicationId,
      document_type: docType,
      file_name: file.originalname,
      file_url: fileUrl,
      file_size: file.size,
      mime_type: file.mimetype,
    });
    return this.documentRepo.save(doc);
  }

  async deleteDocument(
    applicationId: string,
    docId: string,
    userId: string,
  ): Promise<void> {
    await this.getById(applicationId, userId); // ownership check
    const doc = await this.documentRepo.findOne({
      where: { id: docId, application_id: applicationId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    // Delete file from disk
    try {
      const filePath = join(process.cwd(), doc.file_url);
      await unlink(filePath);
    } catch {
      // File may already be gone — continue
    }

    await this.documentRepo.delete(docId);
  }

  async getDocuments(applicationId: string, userId: string): Promise<ApplicationDocument[]> {
    await this.getById(applicationId, userId); // ownership check
    return this.documentRepo.find({ where: { application_id: applicationId } });
  }

  async getAllApplications() {
    return this.applicationRepository.findAll();
  }

  async getByIdAdmin(id: string) {
    const application = await this.applicationRepository.findByIdAdmin(id);
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async updateAdmin(id: string, dto: UpdateApplicationAdminDto) {
    const application = await this.applicationRepository.findByIdAdmin(id);
    if (!application) throw new NotFoundException('Application not found');
    return this.applicationRepository.updateFields(id, dto);
  }

  async changeStatusAdmin(id: string, dto: ChangeStatusDto) {
    const application = await this.applicationRepository.findByIdAdmin(id);
    if (!application) throw new NotFoundException('Application not found');
    if (application.status === dto.status) return application;
    return this.applicationRepository.changeStatus(id, application.status, dto.status, dto.comment);
  }
}
