export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
export const IMG_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

export const TABS = [
  "Overview",
  "Courses",
  "Requirements",
  "Scholarships",
  "Accommodation",
  "Gallery",
  "FAQ",
  "Reviews",
  "AI Assistant",
] as const;

export type Tab = (typeof TABS)[number];

export interface ApiUniversity {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  university_type: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  logo: string;
  banner: string;
  description: string;
  featured: boolean;
  country_id: number;
  city_id: number;
  country?: { name: string };
  city?: { name: string };
  faculties?: { id: number; name: string; description: string }[];
}

export interface ApiImage {
  id: number;
  url: string;
  alt_text: string;
  type: "logo" | "banner" | "gallery";
  sort_order: number;
}

export interface ApiScholarship {
  id: number;
  name: string;
  description: string;
  percentage: number;
  type: string;
  deadline: string;
  scopes?: { scope_type: string; scope_id: number }[];
}

export interface ApiIntake {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  deadline: string;
  status: string;
}

export interface ApiCourse {
  id: number;
  name: string;
  course_code: string;
  tuition_fee: number;
  currency: string;
  duration_months: number;
  intake: string;
  ielts_requirement: number;
  ielts_speaking: number;
  ielts_writing: number;
  ielts_reading: number;
  ielts_listening: number;
  pte_requirement: number;
  pte_speaking: number;
  pte_writing: number;
  pte_reading: number;
  pte_listening: number;
  toefl_requirement: number;
  toefl_speaking: number;
  toefl_writing: number;
  toefl_reading: number;
  toefl_listening: number;
  overview: string;
  scholarship_available: boolean;
  faculty_id: number;
  degree_id: number;
}

export interface ApiDegree {
  id: number;
  name: string;
}

export interface CourseWithFaculty extends ApiCourse {
  facultyName: string;
  degreeName: string;
}

export const COURSE_TINTS = [
  { tint: "rgba(37,99,235,.10)", color: "#2563eb" },
  { tint: "rgba(15,157,88,.10)", color: "#0f9d58" },
  { tint: "rgba(234,88,12,.10)", color: "#ea580c" },
  { tint: "rgba(139,92,246,.10)", color: "#8b5cf6" },
  { tint: "rgba(236,72,153,.10)", color: "#ec4899" },
  { tint: "rgba(20,184,166,.10)", color: "#14b8a6" },
];
