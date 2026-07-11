export const kpis = [
  { label: "Total Students", value: "2,847", delta: "+12.4%", sub: "324 new this month", up: true },
  { label: "Active Applications", value: "1,204", delta: "+8.1%", sub: "across 46 universities", up: true },
  { label: "Pending Review", value: "86", delta: "+23", sub: "18 flagged urgent", up: false },
  { label: "Offer Letters", value: "342", delta: "+18.9%", sub: "112 conditional", up: true },
  { label: "Visa Processing", value: "128", delta: "\u22123.2%", sub: "9 interviews scheduled", up: false },
  { label: "Upcoming Intakes", value: "6", delta: "Sep", sub: "Sep 2026 opens soon", type: "info" as const },
];

export const countryData = [
  { name: "Australia", value: 412, color: "#2563eb" },
  { name: "UK", value: 356, color: "#3b82f6" },
  { name: "Canada", value: 298, color: "#60a5fa" },
  { name: "US", value: 214, color: "#93c5fd" },
  { name: "Germany", value: 132, color: "#bfdbfe" },
  { name: "Ireland", value: 96, color: "#dbeafe" },
];
export const countryMax = 412;

export const intakeData = [
  { name: "Jan", value: 280 },
  { name: "May", value: 190 },
  { name: "Sep", value: 520 },
  { name: "Nov", value: 214 },
];
export const intakeMax = 520;

export const topUnis = [
  { name: "University of Melbourne", initials: "UM", value: 186, color: "#2563eb" },
  { name: "University of Toronto", initials: "UT", value: 164, color: "#7c3aed" },
  { name: "University College London", initials: "UCL", value: 142, color: "#0891b2" },
  { name: "University of Sydney", initials: "US", value: 118, color: "#ea580c" },
  { name: "TU Munich", initials: "TUM", value: 94, color: "#16a34a" },
];
export const uniMax = 186;

export const pipelineData = [
  { name: "Lead", value: 480 },
  { name: "Profile Complete", value: 356 },
  { name: "Docs Pending", value: 298 },
  { name: "Ready for Review", value: 214 },
  { name: "Applied", value: 176 },
  { name: "Conditional Offer", value: 132 },
  { name: "Offer Received", value: 98 },
  { name: "Visa", value: 64 },
  { name: "Completed", value: 42 },
];
export const pipelineMax = 480;

export const activities = [
  { initials: "AK", who: "Arjun Kapoor", action: "moved", target: "to Offer Received", time: "12 minutes ago", color: "#2563eb" },
  { initials: "MC", who: "Mei Chen", action: "uploaded transcript for", target: "Sydney application", time: "38 minutes ago", color: "#7c3aed" },
  { initials: "SY", who: "Sofia Yilmaz", action: "requested changes on", target: "SOP draft", time: "1 hour ago", color: "#ea580c" },
  { initials: "DN", who: "David Nkemelu", action: "submitted application to", target: "UCL", time: "2 hours ago", color: "#0891b2" },
  { initials: "PR", who: "You", action: "assigned", target: "Fatima Al-Sayed to Neha", time: "3 hours ago", color: "#16a34a" },
];

export const tasks = [
  { title: "Review Fatima Al-Sayed\u2019s visa documents", priority: "High", due: "Due today", prioColor: "#dc2626", prioBg: "#fef3f2" },
  { title: "Follow up on Melbourne conditional offer", priority: "High", due: "Due today", prioColor: "#dc2626", prioBg: "#fef3f2" },
  { title: "Verify IELTS scores \u2014 3 students", priority: "Medium", due: "Tomorrow", prioColor: "#d97706", prioBg: "#fffaeb" },
  { title: "Prepare Sep intake shortlist for UCL", priority: "Medium", due: "Jul 5", prioColor: "#d97706", prioBg: "#fffaeb" },
  { title: "Update scholarship deadlines for Canada", priority: "Low", due: "Jul 8", prioColor: "#71717a", prioBg: "#f4f4f5" },
];

export const messages = [
  { initials: "MC", name: "Mei Chen", preview: "Thank you! When should I expect the offer?", time: "9:42", color: "#7c3aed", unread: true },
  { initials: "AK", name: "Arjun Kapoor", preview: "I\u2019ve uploaded my updated passport scan.", time: "9:10", color: "#2563eb", unread: true },
  { initials: "DN", name: "David Nkemelu", preview: "Is the January intake still open for CS?", time: "Yesterday", color: "#0891b2", unread: false },
  { initials: "SY", name: "Sofia Yilmaz", preview: "Got it, I\u2019ll revise the SOP tonight.", time: "Yesterday", color: "#ea580c", unread: false },
];
