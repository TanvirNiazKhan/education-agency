export const columns = [
  "Degree",
  "Program",
  "Faculty",
  "Duration",
  "Annual Tuition",
  "App Fee",
  "IELTS",
  "PTE",
  "GRE",
  "Scholarship",
  "Deadline",
  "Status",
];

export const defaultCourseRows = [
  ["Master", "MSc Data Science", "Engineering & IT", "2 yrs", "A$48,000", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["Master", "Master of Engineering", "Engineering & IT", "2 yrs", "A$46,400", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["Bachelor", "Bachelor of Commerce", "Business & Economics", "3 yrs", "A$44,000", "A$100", "6.5", "58", "—", "No", "30 Sep 2026", "Open"],
  ["Master", "Master of IT", "Engineering & IT", "2 yrs", "A$47,200", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["PhD", "PhD Computer Science", "Engineering & IT", "3-4 yrs", "A$42,800", "Waived", "7.0", "65", "—", "Yes", "31 Oct 2026", "Open"],
  ["Master", "MSc Finance", "Business & Economics", "1.5 yrs", "A$49,200", "A$100", "7.0", "65", "—", "Yes", "15 Sep 2026", "Closing"],
  ["Bachelor", "BSc Computer Science", "Engineering & IT", "3 yrs", "A$46,000", "A$100", "6.5", "58", "—", "No", "30 Sep 2026", "Open"],
  ["Master", "MA International Relations", "Arts & Humanities", "2 yrs", "A$38,400", "A$100", "7.0", "65", "—", "No", "31 Aug 2026", "Open"],
  ["Diploma", "Graduate Diploma Education", "Arts & Humanities", "1 yr", "A$34,800", "A$75", "7.5", "73", "—", "No", "30 Jun 2026", "Closed"],
  ["Master", "Master of Architecture", "Design", "3 yrs", "A$44,800", "A$100", "6.5", "58", "—", "Yes", "15 Sep 2026", "Draft"],
];

export const uniOptions = [
  { name: "University of Melbourne", init: "UM", city: "Melbourne", country: "Australia", color: "#2563eb", courses: 12 },
  { name: "University of Toronto", init: "UT", city: "Toronto", country: "Canada", color: "#7c3aed", courses: 9 },
  { name: "University College London", init: "UCL", city: "London", country: "United Kingdom", color: "#0891b2", courses: 14 },
  { name: "University of Sydney", init: "US", city: "Sydney", country: "Australia", color: "#ea580c", courses: 11 },
  { name: "TU Munich", init: "TUM", city: "Munich", country: "Germany", color: "#16a34a", courses: 8 },
];

export const fieldOptions = [
  "All fields",
  "Engineering & IT",
  "Business & Economics",
  "Science",
  "Law",
  "Design",
  "Health & Medicine",
  "Arts & Humanities",
];

export const degreeOptions = ["Bachelor", "Master", "PhD", "Diploma"];
export const statusOptions = ["Open", "Closing", "Draft", "Closed"];
export const facultyOptions = fieldOptions.filter((f) => f !== "All fields");

export interface CourseForm {
  degree: string;
  program: string;
  faculty: string;
  duration: string;
  tuition: string;
  appFee: string;
  ielts: string;
  pte: string;
  gre: string;
  scholarship: string;
  deadline: string;
  status: string;
}

export const emptyForm: CourseForm = {
  degree: "Master",
  program: "",
  faculty: "Engineering & IT",
  duration: "",
  tuition: "",
  appFee: "",
  ielts: "",
  pte: "",
  gre: "",
  scholarship: "No",
  deadline: "",
  status: "Draft",
};

export const GRID_TEMPLATE =
  "44px minmax(80px,1fr) minmax(180px,2.5fr) minmax(120px,1.5fr) minmax(70px,0.8fr) minmax(90px,1fr) minmax(70px,0.8fr) minmax(55px,0.6fr) minmax(50px,0.5fr) minmax(50px,0.5fr) minmax(90px,1fr) minmax(90px,1fr) minmax(80px,0.8fr)";

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--c-text-2)",
  marginBottom: "6px",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "36px",
  padding: "0 11px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "9px",
  background: "var(--c-bg-input)",
  color: "var(--c-text-1)",
  fontSize: "13px",
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "30px",
};
