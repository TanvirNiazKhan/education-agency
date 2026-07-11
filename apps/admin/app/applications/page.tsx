"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { filterBtnStyle } from "@/components/ui";
import { kanbanData } from "./_data/constants";
import { BoardView } from "./_components/board-view";
import { TableView } from "./_components/table-view";

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  const totalCards = kanbanData.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="px-4 pt-4 pb-3 sm:px-8 sm:pt-[22px] sm:pb-4" style={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline" style={{ gap: "11px" }}>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
              Applications
            </h1>
            <span style={{ fontSize: "13px", color: "var(--c-text-4)" }}>
              {totalCards} active &middot; drag cards to move stage
            </span>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: "8px" }}>
            <div className="flex" style={{ background: "var(--c-bg-surface)", borderRadius: "9px", padding: "3px" }}>
              {(["board", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center cursor-pointer ${mode === "board" ? "gap-[5px]" : ""}`}
                  style={{
                    border: "none",
                    background: viewMode === mode ? "var(--c-bg-elevated)" : "transparent",
                    boxShadow: viewMode === mode ? "0 1px 2px var(--c-shadow)" : "none",
                    color: viewMode === mode ? "var(--c-text-1)" : "var(--c-text-3)",
                    fontSize: "12.5px",
                    fontWeight: viewMode === mode ? 550 : 500,
                    padding: "5px 12px",
                    borderRadius: "7px",
                  }}
                >
                  {mode === "board" && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="6" height="18" rx="1.5" />
                      <rect x="10" y="3" width="6" height="12" rx="1.5" />
                      <rect x="17" y="3" width="4" height="8" rx="1.5" />
                    </svg>
                  )}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
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

      {viewMode === "board" ? <BoardView /> : <TableView />}
    </div>
  );
}
