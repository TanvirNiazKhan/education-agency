export type StudentStatus = "lead" | "active" | "enrolled" | "graduated" | "inactive";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber: string;
  preferredCountry: string;
  intake: string;
  degreeLevel: string;
  status: StudentStatus;
  counselorId: string;
  counselorName: string;
  ieltsOverall: number | null;
  gpa: string;
  university: string;
  createdAt: string;
  updatedAt: string;
}
