export type DegreeLevel = "Bachelor" | "Master" | "PhD" | "Foundation" | "Diploma";
export type CourseStatus = "Open" | "Closing" | "Draft";

export interface Course {
  id: string;
  universityId: string;
  universityName: string;
  name: string;
  field: string;
  degree: DegreeLevel;
  duration: string;
  tuition: string;
  applicationFee: string;
  ieltsMin: number | null;
  pteMin: number | null;
  greRequired: boolean;
  scholarshipAvailable: boolean;
  deadline: string;
  status: CourseStatus;
}
