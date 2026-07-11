"use client";

import { useState } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";
import { filterBtnStyle, StatusChip, Avatar, avatarColors, getInitials } from "@/components/ui";
import { rawStudents } from "./_data/constants";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const students = rawStudents.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="px-4 pt-[18px] md:px-8 md:pt-[22px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "18px" }}>
          <div className="flex items-baseline" style={{ gap: "11px" }}>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
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
            <Search className="absolute top-1/2 -translate-y-1/2" style={{ left: "10px" }} width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
            <input
              placeholder="Search students\u2026"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: "32px", padding: "0 10px 0 30px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", fontSize: "12.5px" }}
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
          <button style={{ ...filterBtnStyle, background: "var(--c-chip-info-bg)", color: "var(--c-chip-info-text)", borderColor: "var(--c-nav-active-border)" }}>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "28px minmax(190px,1.4fr) 108px 130px 96px 158px 156px 96px",
                alignItems: "center",
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
                <div style={{ width: "15px", height: "15px", border: "1.6px solid var(--c-border-check)", borderRadius: "4px" }} />
              </div>
              <div>Student</div>
              <div>Nationality</div>
              <div>Preferred</div>
              <div>Intake</div>
              <div>Status</div>
              <div>Counselor</div>
              <div style={{ textAlign: "right" }}>Updated</div>
            </div>

            {students.map((s, idx) => {
              const color = avatarColors[idx % avatarColors.length];
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
                    padding: "0 14px",
                    height: "56px",
                    borderBottom: "1px solid var(--c-border-light)",
                    background: hoveredRow === idx ? "var(--c-bg-panel)" : "var(--c-bg-elevated)",
                  }}
                >
                  <div>
                    <div style={{ width: "15px", height: "15px", border: "1.6px solid var(--c-border-check)", borderRadius: "4px" }} />
                  </div>
                  <div className="flex items-center min-w-0" style={{ gap: "11px" }}>
                    <Avatar name={s.name} color={color} size={32} />
                    <div className="min-w-0">
                      <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.nationality}</div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.country}</div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{s.intake}</div>
                  <div><StatusChip status={s.status} /></div>
                  <div className="flex items-center min-w-0" style={{ gap: "7px" }}>
                    <div
                      className="flex items-center justify-center text-white"
                      style={{ width: "22px", height: "22px", borderRadius: "50%", background: s.counselorColor, fontSize: "8px", fontWeight: 600, flexShrink: 0 }}
                    >
                      {counselorInit}
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--c-text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
