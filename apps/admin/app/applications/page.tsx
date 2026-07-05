"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";

const stageColors: Record<string, string> = {
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

const priorityStyles: Record<string, { bg: string; color: string }> = {
  High: { bg: "#fef3f2", color: "#dc2626" },
  Medium: { bg: "#fffaeb", color: "#d97706" },
  Low: { bg: "#f4f4f5", color: "#71717a" },
};

const avatarColors = ["#2563eb", "#7c3aed", "#ea580c", "#0891b2", "#16a34a", "#db2777", "#d97706", "#6366f1"];

interface AppCard {
  name: string;
  uni: string;
  country: string;
  intake: string;
  progress: number;
  missingDocs: number;
  priority: string;
}

const kanbanData: { stage: string; cards: AppCard[] }[] = [
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

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function getProgressColor(progress: number) {
  if (progress >= 80) return "#16a34a";
  if (progress >= 50) return "#2563eb";
  if (progress >= 25) return "#d97706";
  return "#a1a1aa";
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

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  const totalCards = kanbanData.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="px-4 pt-4 pb-3 sm:px-8 sm:pt-[22px] sm:pb-4" style={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline" style={{ gap: "11px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "var(--c-text-1)",
              }}
            >
              Applications
            </h1>
            <span style={{ fontSize: "13px", color: "var(--c-text-4)" }}>
              {totalCards} active &middot; drag cards to move stage
            </span>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: "8px" }}>
            <div className="flex" style={{ background: "var(--c-bg-surface)", borderRadius: "9px", padding: "3px" }}>
              <button
                onClick={() => setViewMode("board")}
                className="flex items-center cursor-pointer"
                style={{
                  border: "none",
                  gap: "5px",
                  background: viewMode === "board" ? "var(--c-bg-elevated)" : "transparent",
                  boxShadow: viewMode === "board" ? "0 1px 2px var(--c-shadow)" : "none",
                  color: viewMode === "board" ? "var(--c-text-1)" : "var(--c-text-3)",
                  fontSize: "12.5px",
                  fontWeight: viewMode === "board" ? 550 : 500,
                  padding: "5px 12px",
                  borderRadius: "7px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="6" height="18" rx="1.5" />
                  <rect x="10" y="3" width="6" height="12" rx="1.5" />
                  <rect x="17" y="3" width="4" height="8" rx="1.5" />
                </svg>
                Board
              </button>
              <button
                onClick={() => setViewMode("table")}
                className="cursor-pointer"
                style={{
                  border: "none",
                  background: viewMode === "table" ? "var(--c-bg-elevated)" : "transparent",
                  boxShadow: viewMode === "table" ? "0 1px 2px var(--c-shadow)" : "none",
                  color: viewMode === "table" ? "var(--c-text-1)" : "var(--c-text-3)",
                  fontSize: "12.5px",
                  fontWeight: viewMode === "table" ? 550 : 500,
                  padding: "5px 12px",
                  borderRadius: "7px",
                }}
              >
                Table
              </button>
            </div>
            <button style={filterBtnStyle}>
              <Filter width={13} height={13} stroke="currentColor" strokeWidth={1.8} />
              Filter
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
              New application
            </button>
          </div>
        </div>
      </div>

      {viewMode === "board" ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 sm:px-8 sm:pb-6">
          <div className="flex h-full" style={{ gap: "14px", minWidth: "min-content" }}>
            {kanbanData.map((col) => {
              const dotColor = stageColors[col.stage] || "#a1a1aa";
              return (
                <div
                  key={col.stage}
                  className="flex flex-col"
                  style={{
                    width: "272px",
                    flexShrink: 0,
                    background: "var(--c-bg-kanban)",
                    borderRadius: "14px",
                    border: "1px solid var(--c-border)",
                    height: "100%",
                  }}
                >
                  {/* Column header */}
                  <div className="flex items-center shrink-0" style={{ gap: "8px", padding: "13px 14px 11px" }}>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: dotColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "var(--c-text-2)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {col.stage}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "var(--c-text-4)",
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {col.cards.length}
                    </span>
                    <div className="flex-1" />
                    <button
                      className="flex items-center justify-center cursor-pointer"
                      style={{
                        width: "22px",
                        height: "22px",
                        border: "none",
                        background: "transparent",
                        borderRadius: "6px",
                        color: "var(--c-text-4)",
                      }}
                    >
                      <Plus width={14} height={14} strokeWidth={2.4} />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 9px 9px", gap: "8px" }}>
                    {col.cards.map((c, ci) => {
                      const init = getInitials(c.name);
                      const color = avatarColors[ci % avatarColors.length];
                      const prio = priorityStyles[c.priority] || priorityStyles.Low;
                      const progColor = getProgressColor(c.progress);

                      return (
                        <div
                          key={ci}
                          className="cursor-grab hover:shadow-md"
                          style={{
                            background: "var(--c-bg-elevated)",
                            border: "1px solid var(--c-border)",
                            borderRadius: "11px",
                            padding: "11px 12px",
                            boxShadow: "var(--c-card-shadow)",
                            transition: "box-shadow 0.15s",
                          }}
                        >
                          <div className="flex items-center" style={{ gap: "8px", marginBottom: "9px" }}>
                            <div
                              className="flex items-center justify-center text-white"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                background: color,
                                fontSize: "9.5px",
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {init}
                            </div>
                            <span
                              className="flex-1 min-w-0"
                              style={{
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: "var(--c-text-1)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {c.name}
                            </span>
                            <span
                              style={{
                                fontSize: "10.5px",
                                fontWeight: 600,
                                padding: "1px 7px",
                                borderRadius: "20px",
                                background: prio.bg,
                                color: prio.color,
                              }}
                            >
                              {c.priority}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500, marginBottom: "2px" }}>
                            {c.uni}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "10px" }}>
                            {c.country} &middot; {c.intake}
                          </div>
                          <div
                            style={{
                              height: "5px",
                              background: "var(--c-bg-progress-track)",
                              borderRadius: "5px",
                              overflow: "hidden",
                              marginBottom: "9px",
                            }}
                          >
                            <div
                              style={{
                                width: `${c.progress}%`,
                                height: "100%",
                                background: progColor,
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="flex items-center"
                              style={{
                                gap: "4px",
                                fontSize: "11px",
                                color: c.missingDocs > 0 ? "#d97706" : "var(--c-text-4)",
                                fontWeight: 500,
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              </svg>
                              {c.missingDocs > 0 ? `${c.missingDocs} missing` : "Complete"}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--c-text-4)",
                                fontWeight: 600,
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {c.progress}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-8 sm:pb-10">
          <div className="overflow-x-auto" style={{ border: "1px solid var(--c-border)", borderRadius: "13px" }}>
            <div style={{ minWidth: "826px", overflow: "hidden", borderRadius: "13px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px,1.3fr) 150px 120px 96px 150px 130px",
                alignItems: "center",
                padding: "0 16px",
                height: "38px",
                background: "var(--c-bg-panel)",
                borderBottom: "1px solid var(--c-border)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--c-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              <div>Student</div>
              <div>University</div>
              <div>Country</div>
              <div>Intake</div>
              <div>Stage</div>
              <div>Progress</div>
            </div>
            {kanbanData.flatMap((col) =>
              col.cards.map((c, ci) => {
                const init = getInitials(c.name);
                const color = avatarColors[ci % avatarColors.length];
                const prio = priorityStyles[c.priority] || priorityStyles.Low;
                const stColor = stageColors[col.stage] || "#a1a1aa";
                const progColor = getProgressColor(c.progress);

                return (
                  <div
                    key={`${col.stage}-${ci}`}
                    className="hover:bg-[#fafafa] cursor-pointer"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(180px,1.3fr) 150px 120px 96px 150px 130px",
                      alignItems: "center",
                      padding: "0 16px",
                      height: "54px",
                      borderBottom: "1px solid var(--c-border-light)",
                      background: "var(--c-bg-elevated)",
                    }}
                  >
                    <div className="flex items-center min-w-0" style={{ gap: "11px" }}>
                      <div
                        className="flex items-center justify-center text-white"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: color,
                          fontSize: "11px",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {init}
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
                          {c.name}
                        </div>
                        <div style={{ fontSize: "11px" }}>
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 600,
                              padding: "1px 7px",
                              borderRadius: "20px",
                              background: prio.bg,
                              color: prio.color,
                            }}
                          >
                            {c.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.uni}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.country}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.intake}</div>
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
                          background: stColor + "18",
                          color: stColor,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col.stage}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: "8px" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: "var(--c-bg-progress-track)",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${c.progress}%`,
                            height: "100%",
                            background: progColor,
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--c-text-4)",
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {c.progress}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
