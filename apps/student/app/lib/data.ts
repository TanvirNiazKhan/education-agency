export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  rank: number;
  match: number;
  tuition: string;
  sat: number;
  emp: number;
  schShort: string;
  sch: string;
  img: string;
  ielts: string;
  pte: string;
  accent: string;
}

export interface Course {
  id: string;
  title: string;
  uni: string;
  uniId: string;
  faculty: string;
  level: string;
  duration: string;
  tuition: string;
  intake: string;
  abbr: string;
  tint: string;
  icColor: string;
  ielts: string;
  pte: string;
  toefl: string;
  deadline: string;
  salary: string;
}

export interface Destination {
  id: string;
  name: string;
  unis: number;
  courses: string;
  img: string;
}

export interface Intake {
  mon: string;
  day: string;
  name: string;
  sub: string;
  tag: string;
  tagColor: string;
  tagBg: string;
}

export interface Scholarship {
  name: string;
  uni: string;
  who: string;
  amount: string;
  deadline: string;
}

export interface Story {
  quote: string;
  name: string;
  dest: string;
  initials: string;
  av: string;
}

export interface VisaApproval {
  name: string;
  dest: string;
  type: string;
  when: string;
  initials: string;
  av: string;
}

export const UNIS: University[] = [
  { id: "melb", name: "University of Melbourne", country: "Australia", city: "Melbourne", rank: 14, match: 96, tuition: "\u09F338.5L", sat: 92, emp: 88, schShort: "50% merit", sch: "Melbourne Graduate Scholarship \u2014 up to 50% tuition", img: "linear-gradient(135deg,#1e3a8a,#3b82f6)", ielts: "6.5", pte: "58", accent: "#2563eb" },
  { id: "toronto", name: "University of Toronto", country: "Canada", city: "Toronto", rank: 21, match: 93, tuition: "\u09F342.0L", sat: 90, emp: 89, schShort: "Pearson", sch: "Lester B. Pearson International Scholarship \u2014 full ride", img: "linear-gradient(135deg,#7c2d12,#ea580c)", ielts: "6.5", pte: "60", accent: "#ea580c" },
  { id: "manch", name: "University of Manchester", country: "UK", city: "Manchester", rank: 34, match: 90, tuition: "\u09F334.0L", sat: 89, emp: 86, schShort: "\u00A35k GEA", sch: "Global Excellence Award \u2014 up to \u00A35,000", img: "linear-gradient(135deg,#4c1d95,#7c3aed)", ielts: "6.5", pte: "62", accent: "#7c3aed" },
  { id: "sydney", name: "University of Sydney", country: "Australia", city: "Sydney", rank: 19, match: 88, tuition: "\u09F340.0L", sat: 88, emp: 87, schShort: "20% merit", sch: "Sydney International Scholarship \u2014 up to 20%", img: "linear-gradient(135deg,#0e7490,#06b6d4)", ielts: "6.5", pte: "58", accent: "#0891b2" },
  { id: "monash", name: "Monash University", country: "Australia", city: "Melbourne", rank: 37, match: 87, tuition: "\u09F336.0L", sat: 87, emp: 85, schShort: "25% merit", sch: "Monash International Merit Scholarship \u2014 up to A$50k", img: "linear-gradient(135deg,#831843,#db2777)", ielts: "6.5", pte: "58", accent: "#db2777" },
  { id: "ubc", name: "University of British Columbia", country: "Canada", city: "Vancouver", rank: 34, match: 85, tuition: "\u09F339.0L", sat: 89, emp: 86, schShort: "IMES", sch: "International Major Entrance Scholarship", img: "linear-gradient(135deg,#065f46,#10b981)", ielts: "6.5", pte: "65", accent: "#059669" },
];

export const COURSES: Course[] = [
  { id: "mscs", title: "Master of Computer Science", uni: "University of Melbourne", uniId: "melb", faculty: "Faculty of Engineering & IT", level: "Master", duration: "2 years", tuition: "\u09F338.5L/yr", intake: "Feb 2026", abbr: "CS", tint: "#eff4ff", icColor: "#2563eb", ielts: "6.5", pte: "58", toefl: "79", deadline: "31 Oct 2025", salary: "AUD 92,000" },
  { id: "msds", title: "Master of Data Science", uni: "University of Toronto", uniId: "toronto", faculty: "Faculty of Arts & Science", level: "Master", duration: "2 years", tuition: "\u09F342.0L/yr", intake: "Sep 2026", abbr: "DS", tint: "#fff1e9", icColor: "#ea580c", ielts: "6.5", pte: "60", toefl: "93", deadline: "15 Jan 2026", salary: "CAD 95,000" },
  { id: "mba", title: "Master of Business Administration", uni: "University of Manchester", uniId: "manch", faculty: "Alliance Manchester Business School", level: "Master", duration: "18 months", tuition: "\u09F346.0L/yr", intake: "Sep 2026", abbr: "MBA", tint: "#f4efff", icColor: "#7c3aed", ielts: "7.0", pte: "65", toefl: "100", deadline: "30 Nov 2025", salary: "\u00A368,000" },
];

export const DESTINATIONS: Destination[] = [
  { id: "au", name: "Australia", unis: 43, courses: "12k", img: "linear-gradient(135deg,#0e7490,#22d3ee)" },
  { id: "ca", name: "Canada", unis: 38, courses: "9.4k", img: "linear-gradient(135deg,#b91c1c,#f87171)" },
  { id: "uk", name: "United Kingdom", unis: 61, courses: "18k", img: "linear-gradient(135deg,#1e3a8a,#60a5fa)" },
  { id: "us", name: "United States", unis: 120, courses: "31k", img: "linear-gradient(135deg,#3730a3,#818cf8)" },
];

export const INTAKES: Intake[] = [
  { mon: "Feb", day: "01", name: "Australia \u2014 Semester 1", sub: "Melbourne, Sydney, Monash", tag: "Open now", tagColor: "#0f9d58", tagBg: "#e9f9ef" },
  { mon: "Sep", day: "15", name: "Canada \u2014 Fall intake", sub: "Toronto, UBC, Waterloo", tag: "Popular", tagColor: "#2563eb", tagBg: "#eff4ff" },
  { mon: "Sep", day: "22", name: "UK \u2014 Autumn intake", sub: "Manchester, Leeds, Bristol", tag: "Closing soon", tagColor: "#e08a1e", tagBg: "#fdf3e6" },
  { mon: "Jan", day: "10", name: "Canada \u2014 Winter intake", sub: "Limited programs", tag: "Upcoming", tagColor: "#8592ad", tagBg: "#f1f3f8" },
];

export const SCHOLARSHIPS: Scholarship[] = [
  { name: "Melbourne Graduate Scholarship", uni: "Univ. of Melbourne", who: "Merit-based", amount: "50% tuition", deadline: "31 Oct" },
  { name: "Lester B. Pearson Scholarship", uni: "Univ. of Toronto", who: "Full-ride, all costs", amount: "100%", deadline: "15 Nov" },
  { name: "Global Excellence Award", uni: "Univ. of Manchester", who: "International students", amount: "\u00A35,000", deadline: "30 Nov" },
];

export const STORIES: Story[] = [
  { quote: "Odyssey matched me to Melbourne with a 50% scholarship I didn\u2019t know existed. The AI walked me through every document.", name: "Nusrat J.", dest: "MS CS \u00B7 Melbourne", initials: "NJ", av: "linear-gradient(135deg,#2563eb,#60a5fa)" },
  { quote: "I had a 3.15 CGPA and no IELTS. The counsellor found PTE-friendly options and I got into Toronto with aid.", name: "Rafid H.", dest: "MS DS \u00B7 Toronto", initials: "RH", av: "linear-gradient(135deg,#0f9d58,#16b364)" },
  { quote: "From profile to submitted application in 9 days. The progress tracker kept me calm the whole time.", name: "Tania A.", dest: "MBA \u00B7 Manchester", initials: "TA", av: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
];

export const VISAS: VisaApproval[] = [
  { name: "Sadia K.", dest: "Australia \u00B7 Melbourne", type: "Subclass 500", when: "2d ago", initials: "SK", av: "linear-gradient(135deg,#2563eb,#60a5fa)" },
  { name: "Imran M.", dest: "Canada \u00B7 Toronto", type: "Study Permit", when: "3d ago", initials: "IM", av: "linear-gradient(135deg,#ea580c,#fb923c)" },
  { name: "Fahim R.", dest: "UK \u00B7 Manchester", type: "Student Visa", when: "5d ago", initials: "FR", av: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
  { name: "Lamia S.", dest: "Australia \u00B7 Sydney", type: "Subclass 500", when: "1w ago", initials: "LS", av: "linear-gradient(135deg,#0891b2,#22d3ee)" },
];

export const REVIEWS = [
  { name: "Nusrat J.", prog: "MS Computer Science", yr: "2024", rating: 5, initials: "NJ", av: "linear-gradient(135deg,#2563eb,#60a5fa)", text: "World-class faculty and the career support is exceptional. Landed an internship at a top firm in my first year." },
  { name: "Arjun P.", prog: "MS Data Science", yr: "2023", rating: 5, initials: "AP", av: "linear-gradient(135deg,#0f9d58,#16b364)", text: "Beautiful campus, great international community. The scholarship made it affordable for me as a Bangladeshi student." },
  { name: "Mei L.", prog: "MBA", yr: "2024", rating: 4, initials: "ML", av: "linear-gradient(135deg,#7c3aed,#a78bfa)", text: "Rigorous coursework. Melbourne is a fantastic student city \u2014 safe, vibrant, and lots of part-time work." },
];

export const FAQS = [
  { q: "Can I apply without IELTS?", a: "Yes. This university accepts PTE Academic and TOEFL iBT as alternatives to IELTS. Some applicants also qualify via a medium-of-instruction certificate." },
  { q: "What CGPA do I need?", a: "A minimum of 3.0/4.0 is required for postgraduate programs. Applicants with 3.2+ are competitive for merit scholarships." },
  { q: "When are the intakes?", a: "There are two main intakes: February (Semester 1) and July (Semester 2). Applications open roughly 8 months prior." },
  { q: "Is on-campus accommodation guaranteed?", a: "First-year international students are guaranteed a housing offer if they apply before the deadline." },
];

export const DOCS = [
  { name: "Passport", status: "Verified", color: "#0f9d58", bg: "#e9f9ef", tint: "#eff4ff", ic: "PP" },
  { name: "Academic Transcript", status: "Verified", color: "#0f9d58", bg: "#e9f9ef", tint: "#f4efff", ic: "TR" },
  { name: "IELTS / PTE Score", status: "Missing", color: "#e0492e", bg: "#fdecea", tint: "#fff1e9", ic: "EN" },
  { name: "Statement of Purpose", status: "Needs Review", color: "#e08a1e", bg: "#fdf3e6", tint: "#e9f9ef", ic: "SOP" },
  { name: "CV / R\u00E9sum\u00E9", status: "Verified", color: "#0f9d58", bg: "#e9f9ef", tint: "#eef2ff", ic: "CV" },
  { name: "Certificates", status: "Needs Review", color: "#e08a1e", bg: "#fdf3e6", tint: "#fdf3e6", ic: "CE" },
];

export const NOTIFS = [
  { title: "Offer received \uD83C\uDF89", sub: "University of Melbourne \u00B7 MS Computer Science", when: "2h ago", dot: "#0f9d58" },
  { title: "Missing document", sub: "Upload your IELTS/PTE score to continue", when: "5h ago", dot: "#e0492e" },
  { title: "Scholarship deadline soon", sub: "Melbourne Graduate Scholarship closes 31 Oct", when: "1d ago", dot: "#e08a1e" },
  { title: "Application updated", sub: "Your Toronto application moved to Agency Review", when: "2d ago", dot: "#2563eb" },
];

export const TRACKER_STEPS = [
  { label: "Application submitted", date: "15 Sep 2025", desc: "Your application for MS Computer Science at University of Melbourne has been received and is being processed.", done: true },
  { label: "Documents verified", date: "18 Sep 2025", desc: "All uploaded documents have been verified by our team. Academic transcripts and passport confirmed.", done: true },
  { label: "Agency review", date: "22 Sep 2025", desc: "Our counsellors reviewed your application and added supporting documents for the scholarship.", done: true },
  { label: "Submitted to university", date: "25 Sep 2025", desc: "Application officially submitted to University of Melbourne admissions portal.", done: true },
  { label: "University assessment", date: "10 Oct 2025", desc: "The university is reviewing your application. Average processing time is 4\u20136 weeks.", done: true },
  { label: "Conditional offer", date: "28 Oct 2025", desc: "Congratulations! You received a conditional offer. Condition: provide English proficiency score.", done: true },
  { label: "Offer accepted", date: "2 Nov 2025", desc: "You accepted the offer and paid the deposit. CoE will be issued within 5 business days.", done: true, current: true },
  { label: "Visa application", date: "Pending", desc: "Once your CoE is issued, we\u2019ll guide you through the student visa (Subclass 500) application.", done: false },
];

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/search" },
  { label: "Apply", href: "/apply" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Compare", href: "/compare" },
  { label: "AI Chat", href: "/chat" },
];

export const SUGGEST_CHIPS = [
  "Computer Science in Australia",
  "Scholarships for 3.2 CGPA",
  "PTE-friendly universities",
  "MBA in UK",
  "Affordable MS programs",
  "Canada vs Australia",
  "Data Science courses",
  "No IELTS required",
];

export const AI_PROMPTS = [
  "What universities match my profile?",
  "How to get a scholarship?",
  "Australia vs Canada for CS?",
  "Help me write my SOP",
];

export const COMPARE_ROWS = [
  "World ranking", "Annual tuition", "Living cost/yr", "Scholarship", "IELTS", "PTE",
  "Duration", "Employment rate", "Internship", "Post-study visa", "Location", "Climate", "Student satisfaction",
];

export const COMPARE_EXTRA: Record<string, { living: string; duration: string; internship: string; visa: string; climate: string }> = {
  Australia: { living: "\u09F314L", duration: "2 years", internship: "Yes", visa: "2\u20134 years", climate: "Mild" },
  Canada: { living: "\u09F312L", duration: "2 years", internship: "Co-op", visa: "3 years", climate: "Cold" },
  UK: { living: "\u09F315L", duration: "1 year", internship: "Optional", visa: "2 years", climate: "Cool" },
};

export const CHAT_TOPICS = [
  { icon: "\uD83C\uDF93", label: "University shortlist", tint: "#eff4ff", color: "#2563eb" },
  { icon: "\uD83D\uDCB0", label: "Scholarships & aid", tint: "#e9f9ef", color: "#0f9d58" },
  { icon: "\uD83C\uDDFA\uD83C\uDDF3", label: "Country comparison", tint: "#f4efff", color: "#7c3aed" },
  { icon: "\uD83D\uDCC4", label: "SOP & documents", tint: "#fff1e9", color: "#ea580c" },
];

export const JOURNEY_STEPS = [
  "Your program", "About you", "Passport", "Your address",
  "Emergency contact", "Education & English", "Work experience",
  "Documents", "Review & submit",
];

export const DOCS_REQUIRED = [
  { name: "Passport", hint: "Bio page + contact details page." },
  { name: "National ID (NID)", hint: "Both sides, clearly readable." },
  { name: "Academic documents", hint: "Year 10 onward — all marksheets & completion certificates." },
  { name: "English test result", hint: "IELTS or PTE result copy." },
  { name: "Detailed résumé / CV", hint: "Your up-to-date CV." },
  { name: "Legal guardian\u2019s NID", hint: "Your guardian\u2019s national ID." },
  { name: "Statement of Purpose (SOP)", hint: "Why you chose this course and university." },
];

export const DOCS_OPTIONAL = [
  { name: "Course outlines", hint: "Only if you\u2019re applying for credit transfer." },
  { name: "Gap explanation", hint: "With supporting documents, if you have a study or work gap." },
  { name: "Spouse documents", hint: "Passport, marriage certificate & academics, if applicable." },
];

export const INSTITUTIONS = ["CQUniversity Australia", "University of Melbourne", "University of Sydney", "Monash University", "University of Toronto", "University of Manchester"];
export const CAMPUSES = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Rockhampton"];
export const COURSE_LIST = ["Bachelor of Information Technology", "Master of Computer Science", "Master of Data Science", "Master of Business Administration", "Bachelor of Business", "Master of Engineering"];
export const ALL_COUNTRIES = ["Bangladesh", "India", "Nepal", "Pakistan", "Sri Lanka", "Australia", "Canada", "United Kingdom", "United States", "Other"];
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const YEARS_LIST = ["2025","2024","2023","2022","2021","2020","2019","2018","Earlier"];

export const COUNTRIES_FILTER = [
  { key: "Australia", label: "Australia", count: 43, cities: ["Melbourne", "Sydney", "Brisbane", "Perth"] },
  { key: "Canada", label: "Canada", count: 38, cities: ["Toronto", "Vancouver", "Montreal"] },
  { key: "UK", label: "United Kingdom", count: 61, cities: ["London", "Manchester", "Edinburgh"] },
  { key: "USA", label: "United States", count: 120, cities: ["New York", "Boston", "San Francisco"] },
];

export const FIELDS_FILTER = [
  "Computer Science", "Data Science", "Artificial Intelligence",
  "Business & Management", "Engineering", "Nursing", "Law",
];

export function uniById(id: string): University {
  return UNIS.find((u) => u.id === id) || UNIS[0];
}

export function courseById(id: string): Course {
  return COURSES.find((c) => c.id === id) || COURSES[0];
}
