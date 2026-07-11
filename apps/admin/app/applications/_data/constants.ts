export const stageColors: Record<string, string> = {
  Lead: "#a1a1aa",
  "Profile Complete": "#2563eb",
  "Documents Pending": "#d97706",
  "Ready for Review": "#7c3aed",
  Applied: "#0369a1",
  "Conditional Offer": "#a16207",
  "Offer Received": "#15803d",
  Visa: "#c2410c",
  Completed: "#059669",
};

export interface AppCard {
  name: string;
  uni: string;
  country: string;
  intake: string;
  progress: number;
  missingDocs: number;
  priority: string;
}

export const kanbanData: { stage: string; cards: AppCard[] }[] = [
  {
    stage: "Lead",
    cards: [
      { name: "Liam O'Brien", uni: "Monash University", country: "Australia", intake: "Feb 2027", progress: 8, missingDocs: 5, priority: "Low" },
      { name: "Carlos Rivera", uni: "UBC", country: "Canada", intake: "Sep 2026", progress: 12, missingDocs: 4, priority: "Medium" },
    ],
  },
  {
    stage: "Documents Pending",
    cards: [
      { name: "Sofia Yilmaz", uni: "University of Edinburgh", country: "United Kingdom", intake: "Sep 2026", progress: 35, missingDocs: 3, priority: "Medium" },
      { name: "Aisha Khan", uni: "University of Sydney", country: "Australia", intake: "Feb 2027", progress: 28, missingDocs: 4, priority: "High" },
    ],
  },
  {
    stage: "Ready for Review",
    cards: [
      { name: "Yuki Tanaka", uni: "Stanford University", country: "United States", intake: "Fall 2026", progress: 55, missingDocs: 1, priority: "High" },
    ],
  },
  {
    stage: "Applied",
    cards: [
      { name: "David Nkemelu", uni: "University College London", country: "United Kingdom", intake: "Jan 2027", progress: 65, missingDocs: 0, priority: "Medium" },
    ],
  },
  {
    stage: "Conditional Offer",
    cards: [
      { name: "Mei Chen", uni: "University of Melbourne", country: "Australia", intake: "Sep 2026", progress: 78, missingDocs: 1, priority: "High" },
      { name: "Arjun Kapoor", uni: "University of Melbourne", country: "Australia", intake: "Jul 2026", progress: 72, missingDocs: 1, priority: "High" },
    ],
  },
  {
    stage: "Offer Received",
    cards: [
      { name: "Arjun Kapoor", uni: "Monash University", country: "Australia", intake: "Jul 2026", progress: 85, missingDocs: 0, priority: "Medium" },
    ],
  },
  {
    stage: "Visa",
    cards: [
      { name: "Fatima Al-Sayed", uni: "LSE", country: "United Kingdom", intake: "Jan 2027", progress: 94, missingDocs: 0, priority: "High" },
    ],
  },
  {
    stage: "Completed",
    cards: [
      { name: "Amara Okafor", uni: "Edinburgh", country: "United Kingdom", intake: "Sep 2026", progress: 100, missingDocs: 0, priority: "Low" },
    ],
  },
];
