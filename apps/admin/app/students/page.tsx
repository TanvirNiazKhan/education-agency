"use client";

import { useState } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Lead: { bg: "#f4f4f5", color: "#52525b" },
  "Profile Complete": { bg: "#eef4ff", color: "#2563eb" },
  "Documents Pending": { bg: "#fffaeb", color: "#b45309" },
  "Ready for Review": { bg: "#f3e8ff", color: "#7c3aed" },
  Applied: { bg: "#e0f2fe", color: "#0369a1" },
  "Conditional Offer": { bg: "#fef9c3", color: "#a16207" },
  "Offer Received": { bg: "#dcfce7", color: "#15803d" },
  Visa: { bg: "#ffedd5", color: "#c2410c" },
  Completed: { bg: "#ecfdf3", color: "#059669" },
};

const avatarColors = ["#2563eb", "#7c3aed", "#ea580c", "#0891b2", "#16a34a", "#db2777", "#d97706", "#6366f1", "#0d9488", "#e11d48"];

const rawStudents = [
  { name: "Mei Chen", email: "mei.chen@gmail.com", nationality: "China", country: "Australia", intake: "Sep 2026", status: "Conditional Offer", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "2 hours ago" },
  { name: "Arjun Kapoor", email: "arjun.k@outlook.com", nationality: "India", country: "Australia", intake: "Jul 2026", status: "Offer Received", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "3 hours ago" },
  { name: "Sofia Yilmaz", email: "sofia.y@gmail.com", nationality: "Turkey", country: "United Kingdom", intake: "Sep 2026", status: "Documents Pending", counselor: "Neha Sharma", counselorColor: "#2563eb", updated: "5 hours ago" },
  { name: "David Nkemelu", email: "david.n@yahoo.com", nationality: "Nigeria", country: "United Kingdom", intake: "Jan 2027", status: "Applied", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "6 hours ago" },
  { name: "Fatima Al-Sayed", email: "fatima.as@gmail.com", nationality: "Egypt", country: "Canada", intake: "Jan 2027", status: "Visa", counselor: "Neha Sharma", counselorColor: "#2563eb", updated: "1 day ago" },
  { name: "Liam O'Brien", email: "liam.ob@proton.me", nationality: "Ireland", country: "Australia", intake: "Feb 2027", status: "Lead", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "1 day ago" },
  { name: "Yuki Tanaka", email: "yuki.t@icloud.com", nationality: "Japan", country: "United States", intake: "Fall 2026", status: "Ready for Review", counselor: "Neha Sharma", counselorColor: "#2563eb", updated: "2 days ago" },
  { name: "Amara Okafor", email: "amara.o@gmail.com", nationality: "Nigeria", country: "United Kingdom", intake: "Sep 2026", status: "Completed", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "2 days ago" },
  { name: "Carlos Rivera", email: "carlos.r@hotmail.com", nationality: "Mexico", country: "Canada", intake: "Sep 2026", status: "Profile Complete", counselor: "Neha Sharma", counselorColor: "#2563eb", updated: "3 days ago" },
  { name: "Aisha Khan", email: "aisha.k@gmail.com", nationality: "Pakistan", country: "Australia", intake: "Feb 2027", status: "Documents Pending", counselor: "Priya Raman", counselorColor: "#ea580c", updated: "3 days ago" },
];

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const filterBtnStyle: React.CSSProperties = {
  height: "30px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "0 10px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "8px",
  background: "var(--c-bg-elevated)",
  color: "var(--c-text-2)",
  fontSize: "12.5px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const students = rawStudents.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="px-4 pt-[18px] md:px-8 md:pt-[22px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "18px" }}>
          <div className="flex items-baseline" style={{ gap: "11px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "var(--c-text-1)",
              }}
            >
              Students
            </h1>
            <span style={{ fontSize: "13px", color: "var(--c-text-4)", fontWeight: 450 }}>
              {students.length} of 2,847
            </span>
          </div>
          <div className="flex" style={{ gap: "8px" }}>
            <button className="flex items-center cursor-pointer" style={{ ...filterBtnStyle, height: "34px" }}>
              <Download width={14} height={14} stroke="currentColor" strokeWidth={1.8} />
              Import
            </button>
            <button
              className="flex items-center cursor-pointer"
              style={{
                height: "34px",
                gap: "7px",
                padding: "0 13px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: 550,
                boxShadow: "0 1px 2px rgba(37,99,235,0.25)",
              }}
            >
              <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />
              New Student
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center flex-wrap" style={{ gap: "8px", paddingBottom: "14px" }}>
          <div className="relative" style={{ minWidth: "160px", maxWidth: "230px", flex: "1" }}>
            <Search
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: "10px" }}
              width={14}
              height={14}
              stroke="var(--c-text-4)"
              strokeWidth={2}
            />
            <input
              placeholder="Search students\u2026"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "32px",
                padding: "0 10px 0 30px",
                border: "1px solid var(--c-border-input)",
                borderRadius: "8px",
                background: "var(--c-bg-elevated)",
                fontSize: "12.5px",
              }}
            />
          </div>
          <div style={{ width: "1px", height: "20px", background: "var(--c-border-divider)" }} />
          {["Country", "Intake", "Counselor", "Degree"].map((f) => (
            <button key={f} style={filterBtnStyle}>
              {f}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
          <button
            style={{
              ...filterBtnStyle,
              background: "var(--c-chip-info-bg)",
              color: "var(--c-chip-info-text)",
              borderColor: "var(--c-nav-active-border)",
            }}
          >
            Status: Active
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1" />
          <button style={filterBtnStyle}>
            <Filter width={13} height={13} stroke="currentColor" strokeWidth={2} />
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-8 md:pb-10">
        <div className="overflow-x-auto">
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "13px", overflow: "hidden", minWidth: "960px" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "28px minmax(190px,1.4fr) 108px 130px 96px 158px 156px 96px",
              alignItems: "center",
              gap: 0,
              padding: "0 14px",
              height: "38px",
              background: "var(--c-bg-panel)",
              borderBottom: "1px solid var(--c-border)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--c-text-label)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            <div>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  border: "1.6px solid var(--c-border-check)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>Student</div>
            <div>Nationality</div>
            <div>Preferred</div>
            <div>Intake</div>
            <div>Status</div>
            <div>Counselor</div>
            <div style={{ textAlign: "right" }}>Updated</div>
          </div>

          {/* Rows */}
          {students.map((s, idx) => {
            const initials = getInitials(s.name);
            const color = avatarColors[idx % avatarColors.length];
            const st = statusStyles[s.status] || { bg: "#f4f4f5", color: "#52525b" };
            const counselorInit = getInitials(s.counselor);

            return (
              <div
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px minmax(190px,1.4fr) 108px 130px 96px 158px 156px 96px",
                  alignItems: "center",
                  gap: 0,
                  padding: "0 14px",
                  height: "56px",
                  borderBottom: "1px solid var(--c-border-light)",
                  background: hoveredRow === idx ? "var(--c-bg-panel)" : "var(--c-bg-elevated)",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      border: "1.6px solid var(--c-border-check)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div className="flex items-center min-w-0" style={{ gap: "11px" }}>
                  <div
                    className="flex items-center justify-center text-white"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color,
                      fontSize: "11.5px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 550,
                        color: "var(--c-text-1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "var(--c-text-4)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.email}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.nationality}</div>
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.country}</div>
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.intake}</div>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11.5px",
                      fontWeight: 550,
                      padding: "2.5px 9px",
                      borderRadius: "20px",
                      background: st.bg,
                      color: st.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="flex items-center min-w-0" style={{ gap: "7px" }}>
                  <div
                    className="flex items-center justify-center text-white"
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: s.counselorColor,
                      fontSize: "8px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {counselorInit}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--c-text-2)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.counselor}
                  </span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", textAlign: "right" }}>
                  {s.updated}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
