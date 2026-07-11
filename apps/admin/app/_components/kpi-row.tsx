import { DeltaChip } from "@/components/ui";
import { kpis } from "../_data/dashboard";

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3.5">
      {kpis.map((k) => (
        <div
          key={k.label}
          style={{
            background: "var(--c-bg-elevated)",
            border: "1px solid var(--c-border)",
            borderRadius: "14px",
            padding: "15px 15px 14px",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--c-text-3)", fontWeight: 500, letterSpacing: "-0.01em" }}>
              {k.label}
            </span>
            <DeltaChip delta={k.delta} up={k.up} type={k.type} />
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "var(--c-text-1)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {k.value}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "6px" }}>{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
