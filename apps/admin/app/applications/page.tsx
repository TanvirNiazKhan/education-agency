"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { filterBtnStyle } from "@/components/ui";
import { applicationsApi, AdminApplication } from "@/lib/api";
import { AppCard, STAGE_ORDER, STATUS_PROGRESS } from "./_data/constants";
import { BoardView } from "./_components/board-view";
import { TableView } from "./_components/table-view";
import { ApplicationDrawer } from "./_components/application-drawer";

function mapToCard(app: AdminApplication): AppCard {
  const name = `${app.student?.user?.first_name ?? ""} ${app.student?.user?.last_name ?? ""}`.trim() || "Unknown";
  const intake = [app.commence_month, app.commence_year].filter(Boolean).join(" ");
  return {
    id: app.id,
    name,
    uni: app.university?.name ?? "—",
    country: app.university?.country?.name ?? "—",
    intake,
    progress: STATUS_PROGRESS[app.status] ?? 0,
    docsUploaded: app.documents?.length ?? 0,
    status: app.status,
  };
}

function buildColumns(apps: AdminApplication[]) {
  const grouped: Record<string, AppCard[]> = {};
  for (const app of apps) {
    const s = app.status;
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(mapToCard(app));
  }

  // Only show stages that have cards, ordered by STAGE_ORDER
  return STAGE_ORDER
    .filter((s) => grouped[s] && grouped[s].length > 0)
    .map((s) => ({ stage: s, cards: grouped[s] }));
}

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<"board" | "table">("table");
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: string) {
    await applicationsApi.changeStatus(id, status);
    // Refresh list to reflect new status
    const updated = await applicationsApi.listAll();
    setApplications(updated);
  }

  useEffect(() => {
    applicationsApi.listAll()
      .then(setApplications)
      .catch((err) => setError(err.message || "Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  const columns = buildColumns(applications);
  const totalCards = applications.length;

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="px-4 pt-4 pb-3 sm:px-8 sm:pt-[22px] sm:pb-4" style={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline" style={{ gap: "11px" }}>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
              Applications
            </h1>
            <span style={{ fontSize: "13px", color: "var(--c-text-4)" }}>
              {loading ? "Loading…" : error ? "Error" : `${totalCards} total`}
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
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-text-4)", fontSize: "14px" }}>
          Loading applications…
        </div>
      )}

      {error && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        viewMode === "board"
          ? <BoardView columns={columns} onCardClick={setSelectedId} />
          : <TableView columns={columns} onCardClick={setSelectedId} onStatusChange={handleStatusChange} />
      )}

      <ApplicationDrawer applicationId={selectedId} onClose={() => setSelectedId(null)} />

      {!loading && !error && applications.length === 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          pointerEvents: "none",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p style={{ fontSize: "14px", color: "var(--c-text-4)", margin: 0 }}>No applications yet</p>
        </div>
      )}
    </div>
  );
}
