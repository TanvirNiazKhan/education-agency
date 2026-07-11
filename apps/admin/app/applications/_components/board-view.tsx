import { Plus } from "lucide-react";
import { Avatar, avatarColors, PriorityChip, getProgressColor } from "@/components/ui";
import { stageColors, kanbanData } from "../_data/constants";

export function BoardView() {
  return (
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
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-2)", letterSpacing: "-0.01em" }}>
                  {col.stage}
                </span>
                <span style={{ fontSize: "11.5px", color: "var(--c-text-4)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                  {col.cards.length}
                </span>
                <div className="flex-1" />
                <button
                  className="flex items-center justify-center cursor-pointer"
                  style={{ width: "22px", height: "22px", border: "none", background: "transparent", borderRadius: "6px", color: "var(--c-text-4)" }}
                >
                  <Plus width={14} height={14} strokeWidth={2.4} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 9px 9px", gap: "8px" }}>
                {col.cards.map((c, ci) => {
                  const color = avatarColors[ci % avatarColors.length];
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
                        <Avatar name={c.name} color={color} size={24} />
                        <span
                          className="flex-1 min-w-0"
                          style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {c.name}
                        </span>
                        <PriorityChip priority={c.priority} />
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500, marginBottom: "2px" }}>
                        {c.uni}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "10px" }}>
                        {c.country} &middot; {c.intake}
                      </div>
                      <div style={{ height: "5px", background: "var(--c-bg-progress-track)", borderRadius: "5px", overflow: "hidden", marginBottom: "9px" }}>
                        <div style={{ width: `${c.progress}%`, height: "100%", background: progColor, borderRadius: "5px" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center" style={{ gap: "4px", fontSize: "11px", color: c.missingDocs > 0 ? "#d97706" : "var(--c-text-4)", fontWeight: 500 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          </svg>
                          {c.missingDocs > 0 ? `${c.missingDocs} missing` : "Complete"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--c-text-4)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
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
  );
}
