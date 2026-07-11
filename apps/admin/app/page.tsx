import { currentUser } from "../lib/mock-data";
import { KpiRow } from "./_components/kpi-row";
import { ChartsSection } from "./_components/charts-section";
import { BottomSection } from "./_components/bottom-section";

export default function Dashboard() {
  return (
    <div
      className="px-4 md:px-8 py-5 md:py-[26px] pb-10 md:pb-[60px]"
      style={{ maxWidth: "1360px", margin: "0 auto", animation: "fadeUp 0.35s ease" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" style={{ marginBottom: "22px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
            Good morning, {currentUser.name.split(" ")[0]}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--c-text-3)" }}>
            Here&apos;s what&apos;s happening across your agency today.
          </p>
        </div>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <div className="flex" style={{ background: "var(--c-bg-surface)", borderRadius: "9px", padding: "3px" }}>
            {["This month", "Quarter", "Year"].map((label, i) => (
              <button
                key={label}
                style={{
                  border: "none",
                  background: i === 0 ? "var(--c-bg-elevated)" : "transparent",
                  boxShadow: i === 0 ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  color: i === 0 ? "var(--c-text-1)" : "var(--c-text-3)",
                  fontSize: "12.5px",
                  fontWeight: i === 0 ? 550 : 500,
                  padding: "5px 12px",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
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

      <KpiRow />
      <ChartsSection />
      <BottomSection />
    </div>
  );
}
