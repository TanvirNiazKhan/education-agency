"use client";

import { useState } from "react";
import { Search, Plus, Check, Edit3 } from "lucide-react";

const universities = [
  { id: "1", name: "University of Melbourne", init: "UM", city: "Melbourne", country: "Australia", color: "#2563eb", type: "Public" as const, qs: 14, the: 37, courses: 12, apps: 186, website: "unimelb.edu.au", desc: "The University of Melbourne is a leading research-intensive university in Australia, consistently ranked among the world's top universities. Known for its Melbourne Model curriculum, it offers broad-based undergraduate degrees followed by professional graduate programs." },
  { id: "2", name: "University of Toronto", init: "UT", city: "Toronto", country: "Canada", color: "#7c3aed", type: "Public" as const, qs: 21, the: 18, courses: 9, apps: 164, website: "utoronto.ca", desc: "Canada's top university, renowned for groundbreaking research in AI, medicine, and engineering. Three campuses offer diverse academic opportunities." },
  { id: "3", name: "University College London", init: "UCL", city: "London", country: "United Kingdom", color: "#0891b2", type: "Public" as const, qs: 9, the: 22, courses: 14, apps: 142, website: "ucl.ac.uk", desc: "A world-leading multidisciplinary university in central London with a focus on cross-disciplinary collaboration and global impact." },
  { id: "4", name: "University of Sydney", init: "US", city: "Sydney", country: "Australia", color: "#ea580c", type: "Public" as const, qs: 19, the: 60, courses: 11, apps: 118, website: "sydney.edu.au", desc: "Australia's first university, offering a broad range of programs across arts, sciences, engineering, and health in the heart of Sydney." },
  { id: "5", name: "TU Munich", init: "TUM", city: "Munich", country: "Germany", color: "#16a34a", type: "Public" as const, qs: 37, the: 30, courses: 8, apps: 94, website: "tum.de", desc: "Germany's top technical university, excelling in engineering, natural sciences, and technology with strong industry partnerships." },
  { id: "6", name: "McGill University", init: "MG", city: "Montreal", country: "Canada", color: "#db2777", type: "Public" as const, qs: 30, the: 46, courses: 7, apps: 76, website: "mcgill.ca", desc: "One of Canada's most prestigious universities, known for its research output, medical school, and bilingual Montreal setting." },
  { id: "7", name: "Imperial College London", init: "IC", city: "London", country: "United Kingdom", color: "#d97706", type: "Public" as const, qs: 6, the: 8, courses: 10, apps: 89, website: "imperial.ac.uk", desc: "A world-class science, engineering, medicine and business university in London, consistently ranked in the global top 10." },
];

const uniCourses = [
  { name: "MSc Data Science", degree: "Master", duration: "2 yrs", tuition: "A$48,000", ielts: "6.5", scholarship: true },
  { name: "Master of Engineering", degree: "Master", duration: "2 yrs", tuition: "A$46,400", ielts: "6.5", scholarship: true },
  { name: "Bachelor of Commerce", degree: "Bachelor", duration: "3 yrs", tuition: "A$44,000", ielts: "6.5", scholarship: false },
  { name: "Master of IT", degree: "Master", duration: "2 yrs", tuition: "A$47,200", ielts: "6.5", scholarship: true },
  { name: "PhD Computer Science", degree: "PhD", duration: "3-4 yrs", tuition: "A$42,800", ielts: "7.0", scholarship: true },
];

const highlights = [
  "94% graduate employment rate",
  "Post-study work visa eligible",
  "40+ scholarships for internationals",
  "Conditional offers in 5\u201310 days",
];

const tabs = ["Overview", "Courses", "Requirements", "Scholarships", "Intakes", "Campuses", "Documents", "Gallery", "FAQs", "AI Knowledge"];

export default function UniversitiesPage() {
  const [activeId, setActiveId] = useState("1");
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const filtered = universities.filter(
    (u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.country.toLowerCase().includes(search.toLowerCase()) || u.city.toLowerCase().includes(search.toLowerCase())
  );
  const active = universities.find((u) => u.id === activeId) || universities[0];

  return (
    <div
      className="h-full grid grid-cols-1 md:grid-cols-[296px_1fr]"
      style={{
        animation: "fadeUp 0.28s ease",
      }}
    >
      {/* LEFT: University list */}
      <div className="flex flex-col overflow-hidden max-h-[40vh] md:max-h-none" style={{ borderRight: "1px solid var(--c-border)" }}>
        <div style={{ padding: "18px 16px 12px", flexShrink: 0 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
            <h1 style={{ margin: 0, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
              Universities
            </h1>
            <button
              className="flex items-center justify-center cursor-pointer"
              style={{ width: "28px", height: "28px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", color: "var(--c-text-2b)" }}
            >
              <Plus width={15} height={15} strokeWidth={2.2} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2" style={{ left: "10px" }} width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities\u2026"
              style={{ width: "100%", height: "32px", padding: "0 10px 0 30px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-panel)", fontSize: "12.5px" }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 10px 16px", gap: "2px" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "26px 12px", textAlign: "center", color: "var(--c-text-4)", fontSize: "12.5px" }}>
              No universities match your search.
            </div>
          )}
          {filtered.map((u) => (
            <div
              key={u.id}
              onClick={() => { setActiveId(u.id); setActiveTab("Overview"); }}
              className="flex items-center cursor-pointer hover:bg-bg-hover"
              style={{
                gap: "11px",
                padding: "9px 11px",
                borderRadius: "10px",
                background: u.id === activeId ? "var(--c-nav-active-bg)" : "transparent",
                border: u.id === activeId ? "1px solid var(--c-nav-active-border)" : "1px solid transparent",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: u.color + "18",
                  color: u.color,
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {u.init}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "12.5px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>
                  {u.city}, {u.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: Details */}
      <div className="flex flex-col overflow-hidden">
        <div className="px-4 pt-4 md:px-[26px] md:pt-[20px]" style={{ flexShrink: 0 }}>
          <div className="flex items-center" style={{ gap: "14px", marginBottom: "16px" }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: active.color + "18",
                color: active.color,
                fontSize: "17px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {active.init}
            </div>
            <div className="flex-1">
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
                {active.name}
              </h2>
              <div className="flex items-center" style={{ gap: "12px", marginTop: "4px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--c-text-3)" }}>{active.city}, {active.country}</span>
                <span style={{ fontSize: "12.5px", color: "#2563eb" }}>{active.website}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-2b)", background: "var(--c-bg-surface)", padding: "2px 8px", borderRadius: "20px" }}>
                  {active.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex overflow-x-auto" style={{ gap: "22px", borderBottom: "1px solid var(--c-border)" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="cursor-pointer"
                style={{
                  padding: "10px 3px",
                  fontSize: "13px",
                  fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? "var(--c-text-1)" : "var(--c-text-4)",
                  border: "none",
                  background: "transparent",
                  borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
                  marginBottom: "-1px",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 md:px-[26px] md:pt-[20px] md:pb-[40px]">
          {/* Overview tab */}
          {activeTab === "Overview" && (
            <div className="flex flex-col" style={{ gap: "18px", maxWidth: "720px" }}>
              <div className="flex items-center justify-between">
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>University details</h4>
                <button
                  className="flex items-center cursor-pointer"
                  style={{ height: "30px", gap: "5px", padding: "0 10px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", color: "var(--c-text-2)", fontSize: "12.5px", fontWeight: 500 }}
                >
                  <Edit3 width={13} height={13} strokeWidth={1.9} />
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "12px" }}>
                {[
                  { label: "QS Ranking", value: `#${active.qs}` },
                  { label: "THE Ranking", value: `#${active.the}` },
                  { label: "Courses", value: `${active.courses}` },
                  { label: "Our applicants", value: `${active.apps}`, highlight: true },
                ].map((stat) => (
                  <div key={stat.label} style={{ border: "1px solid var(--c-border)", borderRadius: "12px", padding: "14px 15px" }}>
                    <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{stat.label}</div>
                    <div style={{ fontSize: "22px", fontWeight: 600, color: stat.highlight ? "#2563eb" : "var(--c-text-1)", marginTop: "3px" }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>Overview</h4>
                <p style={{ margin: 0, fontSize: "13.5px", color: "var(--c-text-2b)", lineHeight: 1.65 }}>{active.desc}</p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>Highlights</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
                  {highlights.map((h) => (
                    <div key={h} className="flex items-center" style={{ gap: "9px", border: "1px solid var(--c-border)", borderRadius: "11px", padding: "11px 13px" }}>
                      <Check width={16} height={16} stroke="#16a34a" strokeWidth={1.9} />
                      <span style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses tab */}
          {activeTab === "Courses" && (
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: "13px" }}>
                <div className="relative" style={{ width: "240px" }}>
                  <Search className="absolute top-1/2 -translate-y-1/2" style={{ left: "10px" }} width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
                  <input placeholder="Search courses\u2026" style={{ width: "100%", height: "32px", padding: "0 10px 0 30px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", fontSize: "12.5px" }} />
                </div>
                <button
                  className="flex items-center cursor-pointer"
                  style={{ height: "32px", gap: "6px", padding: "0 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 550 }}
                >
                  <Plus width={14} height={14} stroke="#fff" strokeWidth={2.4} />
                  Add course
                </button>
              </div>
              <div className="overflow-x-auto" style={{ border: "1px solid var(--c-border)", borderRadius: "12px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 100px 90px 120px 70px 110px",
                    padding: "0 14px",
                    height: "36px",
                    alignItems: "center",
                    background: "var(--c-bg-panel)",
                    borderBottom: "1px solid var(--c-border)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: "var(--c-text-label)",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  <div>Course</div><div>Degree</div><div>Duration</div><div>Tuition</div><div>IELTS</div><div>Scholarship</div>
                </div>
                {uniCourses.map((c, i) => (
                  <div
                    key={i}
                    className="hover:bg-[#fafafa]"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 100px 90px 120px 70px 110px",
                      padding: "0 14px",
                      height: "48px",
                      alignItems: "center",
                      borderBottom: "1px solid var(--c-border-light)",
                      background: "var(--c-bg-elevated)",
                    }}
                  >
                    <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.degree}</div>
                    <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.duration}</div>
                    <div style={{ fontSize: "12px", color: "var(--c-text-1)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{c.tuition}</div>
                    <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.ielts}</div>
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: c.scholarship ? "#059669" : "var(--c-text-4)",
                          background: c.scholarship ? "#ecfdf3" : "var(--c-bg-surface)",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {c.scholarship ? "Available" : "\u2014"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements tab */}
          {activeTab === "Requirements" && (
            <div className="flex flex-col" style={{ gap: "8px", maxWidth: "720px" }}>
              {[
                { title: "English Requirements", body: "IELTS 6.5 (no band < 6.0) \u00b7 PTE 58 \u00b7 TOEFL 79. Conditional offers possible with IELTS 6.0." },
                { title: "Academic Requirements", body: "Bachelor degree with minimum 65% weighted average (or equivalent). Honours preferred for research programs." },
                { title: "Gap & Backlog Policy", body: "Max backlogs: 5. Gap accepted: up to 2 years with justification." },
                { title: "Additional Documents", body: "Statement of Purpose, 2 academic references, CV/resume. Portfolio required for design programs." },
                { title: "Financial Requirements", body: "Proof of funds covering first year tuition + A$21,041 living costs. GTE statement required for visa." },
              ].map((r) => (
                <div key={r.title} style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden" }}>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-[#fafafa]" style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>{r.title}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                  <div style={{ padding: "0 16px 15px", fontSize: "13px", color: "var(--c-text-2b)", lineHeight: 1.6 }}>{r.body}</div>
                </div>
              ))}
            </div>
          )}

          {/* Scholarships tab */}
          {activeTab === "Scholarships" && (
            <div>
              <div className="flex justify-end" style={{ marginBottom: "13px" }}>
                <button
                  className="flex items-center cursor-pointer"
                  style={{ height: "32px", gap: "6px", padding: "0 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 550 }}
                >
                  <Plus width={14} height={14} stroke="#fff" strokeWidth={2.4} />
                  Add scholarship
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "13px" }}>
                {[
                  { name: "Melbourne International Scholarship", coverage: "50% tuition", desc: "Merit-based scholarship for high-achieving international students in STEM fields.", eligibility: "GPA 3.7+ & IELTS 7.0", deadline: "31 Aug 2026" },
                  { name: "Graduate Research Scholarship", coverage: "Full tuition + stipend", desc: "Covers full tuition fees and provides a living allowance for research degree candidates.", eligibility: "Honours/Master with research", deadline: "31 Oct 2026" },
                  { name: "Faculty of Engineering Award", coverage: "A$10,000", desc: "One-time award for international students enrolling in engineering programs.", eligibility: "Engineering applicants", deadline: "15 Sep 2026" },
                ].map((s) => (
                  <div key={s.name} style={{ border: "1px solid var(--c-border)", borderRadius: "13px", padding: "16px 17px" }}>
                    <h4 style={{ margin: "0 0 9px", fontSize: "13.5px", fontWeight: 600, color: "var(--c-text-1)", lineHeight: 1.35 }}>{s.name}</h4>
                    <div style={{ display: "inline-flex", fontSize: "12px", fontWeight: 600, color: "#059669", background: "#ecfdf3", padding: "3px 10px", borderRadius: "20px", marginBottom: "11px" }}>
                      {s.coverage}
                    </div>
                    <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--c-text-3)", lineHeight: 1.55 }}>{s.desc}</p>
                    <div className="flex justify-between" style={{ borderTop: "1px solid var(--c-border-light)", paddingTop: "10px" }}>
                      <div>
                        <div style={{ fontSize: "10.5px", color: "var(--c-text-4)" }}>Eligibility</div>
                        <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500 }}>{s.eligibility}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10.5px", color: "var(--c-text-4)" }}>Deadline</div>
                        <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500 }}>{s.deadline}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intakes tab */}
          {activeTab === "Intakes" && (
            <div style={{ maxWidth: "640px", paddingLeft: "8px" }}>
              {[
                { month: "February", status: "Open", note: "Applications open \u00b7 rolling admissions" },
                { month: "July", status: "Open", note: "Main mid-year intake \u00b7 most programs available" },
                { month: "September", status: "Closing", note: "Limited programs \u00b7 deadline approaching" },
                { month: "November", status: "Closed", note: "Summer research intake only" },
              ].map((intake) => {
                const statusStyle = intake.status === "Open"
                  ? { fontSize: "11px", fontWeight: 600, color: "#059669", background: "#ecfdf3", padding: "2px 9px", borderRadius: "20px" }
                  : intake.status === "Closing"
                  ? { fontSize: "11px", fontWeight: 600, color: "#b45309", background: "#fffaeb", padding: "2px 9px", borderRadius: "20px" }
                  : { fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", background: "var(--c-bg-surface)", padding: "2px 9px", borderRadius: "20px" };
                return (
                  <div key={intake.month} className="flex" style={{ gap: "16px", paddingBottom: "8px" }}>
                    <div className="flex flex-col items-center">
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", border: "2px solid var(--c-bg-elevated)", boxShadow: "0 0 0 1.5px var(--c-nav-active-border)" }} />
                      <div style={{ width: "1.5px", flex: 1, background: "var(--c-border)", minHeight: "34px" }} />
                    </div>
                    <div className="flex-1 cursor-pointer hover:bg-[#fafafa]" style={{ border: "1px solid var(--c-border)", borderRadius: "12px", padding: "13px 15px", marginBottom: "6px" }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{intake.month} 2026</span>
                        <span style={statusStyle}>{intake.status}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--c-text-3)", marginTop: "5px" }}>{intake.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Placeholder tabs */}
          {["Campuses", "Documents", "Gallery", "FAQs", "AI Knowledge"].includes(activeTab) && (
            <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
              {activeTab} content coming soon
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
