import { Plus } from "lucide-react";
import { StatusChip } from "@/components/ui";
import { columns, GRID_TEMPLATE } from "../_data/constants";

export function CourseGrid({
  rows,
  onAddClick,
}: {
  rows: string[][];
  onAddClick: () => void;
}) {
  return (
    <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden", minWidth: "min-content" }}>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: GRID_TEMPLATE,
          background: "var(--c-bg-panel)",
          borderBottom: "1px solid var(--c-border)",
          position: "sticky",
          top: 0,
          zIndex: 3,
        }}
      >
        <div className="flex items-center justify-center" style={{ height: "38px", borderRight: "1px solid var(--c-border-grid)" }}>
          <div style={{ width: "14px", height: "14px", border: "1.6px solid var(--c-border-check)", borderRadius: "4px" }} />
        </div>
        {columns.map((col) => (
          <div
            key={col}
            className="flex items-center"
            style={{
              padding: "0 10px",
              height: "38px",
              borderRight: "1px solid var(--c-border-grid)",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "var(--c-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="hoverable"
          style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              height: "40px",
              borderRight: "1px solid var(--c-border-grid)",
              borderBottom: "1px solid var(--c-border-grid)",
              background: "var(--c-bg-panel)",
              fontSize: "11px",
              color: "var(--c-text-row-num)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {ri + 1}
          </div>
          {row.map((val, ci) => (
            <div
              key={ci}
              className="flex items-center"
              style={{
                padding: "0 10px",
                height: "40px",
                fontSize: "12.5px",
                color: ci === 1 ? "var(--c-text-1)" : "var(--c-text-2)",
                fontWeight: ci === 1 ? 500 : 400,
                borderRight: "1px solid var(--c-border-grid)",
                borderBottom: "1px solid var(--c-border-grid)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                background: "var(--c-bg-elevated)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {ci === 11 ? <StatusChip status={val} /> : val}
            </div>
          ))}
        </div>
      ))}

      {/* Add row */}
      <div
        onClick={onAddClick}
        className="flex items-center cursor-pointer hoverable"
        style={{ gap: "8px", height: "38px", padding: "0 14px", background: "var(--c-bg-elevated)", color: "var(--c-text-4)", fontSize: "12.5px" }}
      >
        <Plus width={14} height={14} strokeWidth={2} />
        Add row
      </div>
    </div>
  );
}
