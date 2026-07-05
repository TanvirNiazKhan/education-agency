export type ApplicationStage =
  | "lead"
  | "documents"
  | "submitted"
  | "under-review"
  | "conditional-offer"
  | "unconditional-offer"
  | "accepted"
  | "enrolled"
  | "rejected";

export type ApplicationPriority = "high" | "medium" | "low";

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  universityId: string;
  universityName: string;
  courseName: string;
  country: string;
  intake: string;
  stage: ApplicationStage;
  priority: ApplicationPriority;
  progress: number;
  missingDocs: number;
  createdAt: string;
  updatedAt: string;
}
