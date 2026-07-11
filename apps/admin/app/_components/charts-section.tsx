import {
  countryData,
  countryMax,
  intakeData,
  intakeMax,
  topUnis,
  uniMax,
  pipelineData,
  pipelineMax,
} from "../_data/dashboard";

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
      {/* Applications by Country */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Applications by Country
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>1,204 total</span>
        </div>
        <div className="flex flex-col" style={{ gap: "13px" }}>
          {countryData.map((c) => (
            <div key={c.name} className="flex items-center" style={{ gap: "12px" }}>
              <span style={{ width: "74px", fontSize: "12.5px", color: "var(--c-text-2)", fontWeight: 500, flexShrink: 0 }}>
                {c.name}
              </span>
              <div style={{ flex: 1, height: "8px", background: "var(--c-bg-bar-track)", borderRadius: "5px", overflow: "hidden" }}>
                <div style={{ width: `${Math.round((c.value / countryMax) * 100)}%`, height: "100%", background: c.color, borderRadius: "5px" }} />
              </div>
              <span style={{ width: "38px", textAlign: "right", fontSize: "12.5px", color: "var(--c-text-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Applications by Intake */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Applications by Intake
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>2026 cycle</span>
        </div>
        <div className="flex items-end justify-around" style={{ gap: "16px", height: "172px", paddingTop: "8px" }}>
          {intakeData.map((i) => (
            <div key={i.name} className="flex flex-col items-center" style={{ flex: 1, gap: "8px", height: "100%", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-1)", fontVariantNumeric: "tabular-nums" }}>{i.value}</span>
              <div style={{ width: "70%", maxWidth: "46px", height: `${Math.round((i.value / intakeMax) * 140)}px`, background: i.name === "Sep" ? "#2563eb" : "#c7dbff", borderRadius: "7px 7px 4px 4px" }} />
              <span style={{ fontSize: "12px", color: "var(--c-text-3)", fontWeight: 500 }}>{i.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Universities */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Top Universities
          </h3>
          <span style={{ fontSize: "11.5px", color: "#2563eb", fontWeight: 500, cursor: "pointer" }}>View all</span>
        </div>
        <div className="flex flex-col" style={{ gap: "11px" }}>
          {topUnis.map((u) => (
            <div key={u.name} className="flex items-center" style={{ gap: "11px" }}>
              <div
                className="flex items-center justify-center"
                style={{ width: "30px", height: "30px", borderRadius: "8px", background: u.color + "18", color: u.color, fontSize: "10.5px", fontWeight: 700, flexShrink: 0 }}
              >
                {u.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.name}
                </div>
                <div style={{ height: "5px", background: "var(--c-bg-bar-track)", borderRadius: "4px", marginTop: "5px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((u.value / uniMax) * 100)}%`, height: "100%", background: u.color, borderRadius: "5px" }} />
                </div>
              </div>
              <span style={{ fontSize: "12.5px", color: "var(--c-text-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {u.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Pipeline */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Student Pipeline
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>conversion 8.7%</span>
        </div>
        <div className="flex flex-col" style={{ gap: "7px" }}>
          {pipelineData.map((p, idx) => (
            <div key={p.name} className="flex items-center" style={{ gap: "10px" }}>
              <span style={{ width: "118px", fontSize: "11.5px", color: "var(--c-text-2b)", flexShrink: 0 }}>{p.name}</span>
              <div style={{ flex: 1, height: "16px", background: "var(--c-bg-bar-track)", borderRadius: "5px", overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${Math.max(6, Math.round((p.value / pipelineMax) * 100))}%`, height: "100%", background: `hsl(${222 - idx * 4} 83% ${58 + idx * 3}%)`, borderRadius: "5px" }} />
              </div>
              <span style={{ width: "32px", textAlign: "right", fontSize: "11.5px", color: "var(--c-text-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                {p.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
