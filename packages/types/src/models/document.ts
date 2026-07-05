export type DocumentStatus = "verified" | "uploaded" | "pending" | "missing" | "rejected";
export type DocumentType = "passport" | "transcript" | "ielts" | "cv" | "sop" | "offer-letter" | "visa" | "financial";

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  fileSize: string;
  uploadedAt: string;
  meta: string;
}
