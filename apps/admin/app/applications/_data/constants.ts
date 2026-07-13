export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  documents_requested: "Documents Requested",
  conditional_offer: "Conditional Offer",
  unconditional_offer: "Unconditional Offer",
  accepted: "Accepted",
  enrolled: "Enrolled",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const stageColors: Record<string, string> = {
  draft: "#a1a1aa",
  submitted: "#2563eb",
  under_review: "#7c3aed",
  documents_requested: "#d97706",
  conditional_offer: "#a16207",
  unconditional_offer: "#15803d",
  accepted: "#059669",
  enrolled: "#0369a1",
  rejected: "#dc2626",
  withdrawn: "#71717a",
};

export const STAGE_ORDER = [
  "submitted",
  "under_review",
  "documents_requested",
  "conditional_offer",
  "unconditional_offer",
  "accepted",
  "enrolled",
  "rejected",
  "withdrawn",
];

export const STATUS_PROGRESS: Record<string, number> = {
  draft: 0,
  submitted: 10,
  under_review: 25,
  documents_requested: 40,
  conditional_offer: 60,
  unconditional_offer: 75,
  accepted: 85,
  enrolled: 100,
  rejected: 0,
  withdrawn: 0,
};

export interface AppCard {
  id: string;
  name: string;
  uni: string;
  country: string;
  intake: string;
  progress: number;
  docsUploaded: number;
  status: string;
}
