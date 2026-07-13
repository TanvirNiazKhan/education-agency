"use client";

import { useEffect, useState } from "react";
import { dashboardApi, DashboardStats } from "../lib/api";
import { KpiRow } from "./_components/kpi-row";
import { ChartsSection } from "./_components/charts-section";
import { BottomSection } from "./_components/bottom-section";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="px-4 md:px-8 py-5 md:py-[26px] pb-10 md:pb-[60px]"
      style={{ maxWidth: "1360px", margin: "0 auto", animation: "fadeUp 0.35s ease" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" style={{ marginBottom: "22px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
            Dashboard
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--c-text-3)" }}>
            Here&apos;s what&apos;s happening across your agency today.
          </p>
        </div>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <button
            className="flex items-center cursor-pointer"
            style={{
              height: "32px",
              gap: "6px",
              padding: "0 12px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "9px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-2)",
              fontSize: "12.5px",
              fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ minHeight: "400px", color: "var(--c-text-3)", fontSize: "14px" }}>
          Loading dashboard...
        </div>
      ) : stats ? (
        <>
          <KpiRow stats={stats} />
          <ChartsSection stats={stats} />
          <BottomSection />
        </>
      ) : (
        <div className="flex items-center justify-center" style={{ minHeight: "400px", color: "var(--c-text-3)", fontSize: "14px" }}>
          Failed to load dashboard data.
        </div>
      )}
    </div>
  );
}
