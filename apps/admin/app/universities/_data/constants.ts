export interface UniversityItem {
  id: string;
  name: string;
  init: string;
  city: string;
  country: string;
  color: string;
  type: "Public";
  qs: number;
  the: number;
  courses: number;
  apps: number;
  website: string;
  desc: string;
}

export const universities: UniversityItem[] = [
  { id: "1", name: "University of Melbourne", init: "UM", city: "Melbourne", country: "Australia", color: "#2563eb", type: "Public", qs: 14, the: 37, courses: 12, apps: 186, website: "unimelb.edu.au", desc: "The University of Melbourne is a leading research-intensive university in Australia, consistently ranked among the world's top universities. Known for its Melbourne Model curriculum, it offers broad-based undergraduate degrees followed by professional graduate programs." },
  { id: "2", name: "University of Toronto", init: "UT", city: "Toronto", country: "Canada", color: "#7c3aed", type: "Public", qs: 21, the: 18, courses: 9, apps: 164, website: "utoronto.ca", desc: "Canada's top university, renowned for groundbreaking research in AI, medicine, and engineering. Three campuses offer diverse academic opportunities." },
  { id: "3", name: "University College London", init: "UCL", city: "London", country: "United Kingdom", color: "#0891b2", type: "Public", qs: 9, the: 22, courses: 14, apps: 142, website: "ucl.ac.uk", desc: "A world-leading multidisciplinary university in central London with a focus on cross-disciplinary collaboration and global impact." },
  { id: "4", name: "University of Sydney", init: "US", city: "Sydney", country: "Australia", color: "#ea580c", type: "Public", qs: 19, the: 60, courses: 11, apps: 118, website: "sydney.edu.au", desc: "Australia's first university, offering a broad range of programs across arts, sciences, engineering, and health in the heart of Sydney." },
  { id: "5", name: "TU Munich", init: "TUM", city: "Munich", country: "Germany", color: "#16a34a", type: "Public", qs: 37, the: 30, courses: 8, apps: 94, website: "tum.de", desc: "Germany's top technical university, excelling in engineering, natural sciences, and technology with strong industry partnerships." },
  { id: "6", name: "McGill University", init: "MG", city: "Montreal", country: "Canada", color: "#db2777", type: "Public", qs: 30, the: 46, courses: 7, apps: 76, website: "mcgill.ca", desc: "One of Canada's most prestigious universities, known for its research output, medical school, and bilingual Montreal setting." },
  { id: "7", name: "Imperial College London", init: "IC", city: "London", country: "United Kingdom", color: "#d97706", type: "Public", qs: 6, the: 8, courses: 10, apps: 89, website: "imperial.ac.uk", desc: "A world-class science, engineering, medicine and business university in London, consistently ranked in the global top 10." },
];

export const uniCourses = [
  { name: "MSc Data Science", degree: "Master", duration: "2 yrs", tuition: "A$48,000", ielts: "6.5", scholarship: true },
  { name: "Master of Engineering", degree: "Master", duration: "2 yrs", tuition: "A$46,400", ielts: "6.5", scholarship: true },
  { name: "Bachelor of Commerce", degree: "Bachelor", duration: "3 yrs", tuition: "A$44,000", ielts: "6.5", scholarship: false },
  { name: "Master of IT", degree: "Master", duration: "2 yrs", tuition: "A$47,200", ielts: "6.5", scholarship: true },
  { name: "PhD Computer Science", degree: "PhD", duration: "3-4 yrs", tuition: "A$42,800", ielts: "7.0", scholarship: true },
];

export const highlights = [
  "94% graduate employment rate",
  "Post-study work visa eligible",
  "40+ scholarships for internationals",
  "Conditional offers in 5\u201310 days",
];

export const tabs = ["Overview", "Courses", "Requirements", "Scholarships", "Intakes", "Campuses", "Documents", "Gallery", "FAQs", "AI Knowledge"];

export const requirements = [
  { title: "English Requirements", body: "IELTS 6.5 (no band < 6.0) \u00b7 PTE 58 \u00b7 TOEFL 79. Conditional offers possible with IELTS 6.0." },
  { title: "Academic Requirements", body: "Bachelor degree with minimum 65% weighted average (or equivalent). Honours preferred for research programs." },
  { title: "Gap & Backlog Policy", body: "Max backlogs: 5. Gap accepted: up to 2 years with justification." },
  { title: "Additional Documents", body: "Statement of Purpose, 2 academic references, CV/resume. Portfolio required for design programs." },
  { title: "Financial Requirements", body: "Proof of funds covering first year tuition + A$21,041 living costs. GTE statement required for visa." },
];

export const scholarships = [
  { name: "Melbourne International Scholarship", coverage: "50% tuition", desc: "Merit-based scholarship for high-achieving international students in STEM fields.", eligibility: "GPA 3.7+ & IELTS 7.0", deadline: "31 Aug 2026" },
  { name: "Graduate Research Scholarship", coverage: "Full tuition + stipend", desc: "Covers full tuition fees and provides a living allowance for research degree candidates.", eligibility: "Honours/Master with research", deadline: "31 Oct 2026" },
  { name: "Faculty of Engineering Award", coverage: "A$10,000", desc: "One-time award for international students enrolling in engineering programs.", eligibility: "Engineering applicants", deadline: "15 Sep 2026" },
];

export const intakes = [
  { month: "February", status: "Open", note: "Applications open \u00b7 rolling admissions" },
  { month: "July", status: "Open", note: "Main mid-year intake \u00b7 most programs available" },
  { month: "September", status: "Closing", note: "Limited programs \u00b7 deadline approaching" },
  { month: "November", status: "Closed", note: "Summer research intake only" },
];
