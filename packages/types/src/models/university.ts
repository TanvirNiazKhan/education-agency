export interface University {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  city: string;
  type: "Public" | "Private";
  qsRanking: number | null;
  theRanking: number | null;
  website: string;
  description: string;
  courseCount: number;
  applicationCount: number;
  offerRate: number;
  avgDecisionDays: number;
  partnerTier: "Gold" | "Silver" | "Bronze";
}
