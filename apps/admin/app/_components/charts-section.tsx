import { DashboardStats, APPLICATION_STATUSES } from "@/lib/api";

interface Props {
  stats: DashboardStats;
}

const COUNTRY_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];
const UNI_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#ea580c", "#16a34a", "#d97706", "#dc2626", "#6366f1", "#14b8a6", "#f59e0b"];

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  documents_requested: "Docs Requested",
  conditional_offer: "Conditional Offer",
  unconditional_offer: "Unconditional Offer",
  accepted: "Accepted",
  enrolled: "Enrolled",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const PIPELINE_ORDER = [
  "submitted",
  "under_review",
  "documents_requested",
  "conditional_offer",
  "unconditional_offer",
  "accepted",
  "enrolled",
  "rejected",
  "withdrawn",
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

export function ChartsSection({ stats }: Props) {
  const { countryBreakdown, intakeBreakdown, universityBreakdown, statusCounts, totalApplications } = stats;

  const countryMax = countryBreakdown[0]?.count || 1;
  const intakeMax = Math.max(...intakeBreakdown.map((i) => i.count), 1);
  const uniMax = universityBreakdown[0]?.count || 1;

  const pipelineData = PIPELINE_ORDER
    .filter((s) => statusCounts[s])
    .map((s) => ({ name: STATUS_LABELS[s] || s, value: statusCounts[s] || 0 }));
  const pipelineMax = Math.max(...pipelineData.map((p) => p.value), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
      {/* Applications by Country */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Applications by Country
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>{totalApplications} total</span>
        </div>
        {countryBreakdown.length === 0 ? (
          <div style={{ fontSize: "12.5px", color: "var(--c-text-4)", padding: "20px 0", textAlign: "center" }}>No data yet</div>
        ) : (
          <div className="flex flex-col" style={{ gap: "13px" }}>
            {countryBreakdown.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center" style={{ gap: "12px" }}>
                <span style={{ width: "74px", fontSize: "12.5px", color: "var(--c-text-2)", fontWeight: 500, flexShrink: 0 }}>
                  {c.name}
                </span>
                <div style={{ flex: 1, height: "8px", background: "var(--c-bg-bar-track)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((c.count / countryMax) * 100)}%`, height: "100%", background: COUNTRY_COLORS[i] || COUNTRY_COLORS[0], borderRadius: "5px" }} />
                </div>
                <span style={{ width: "38px", textAlign: "right", fontSize: "12.5px", color: "var(--c-text-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications by Intake */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Applications by Intake
          </h3>
        </div>
        {intakeBreakdown.length === 0 ? (
          <div style={{ fontSize: "12.5px", color: "var(--c-text-4)", padding: "20px 0", textAlign: "center" }}>No data yet</div>
        ) : (
          <div className="flex items-end justify-around" style={{ gap: "16px", height: "172px", paddingTop: "8px" }}>
            {intakeBreakdown.map((item, i) => (
              <div key={item.name} className="flex flex-col items-center" style={{ flex: 1, gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-1)", fontVariantNumeric: "tabular-nums" }}>{item.count}</span>
                <div style={{ width: "70%", maxWidth: "46px", height: `${Math.round((item.count / intakeMax) * 140)}px`, background: i === 0 ? "#2563eb" : "#c7dbff", borderRadius: "7px 7px 4px 4px" }} />
                <span style={{ fontSize: "12px", color: "var(--c-text-3)", fontWeight: 500 }}>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Universities */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Top Universities
          </h3>
        </div>
        {universityBreakdown.length === 0 ? (
          <div style={{ fontSize: "12.5px", color: "var(--c-text-4)", padding: "20px 0", textAlign: "center" }}>No data yet</div>
        ) : (
          <div className="flex flex-col" style={{ gap: "11px" }}>
            {universityBreakdown.slice(0, 5).map((u, i) => {
              const initials = u.shortName || getInitials(u.name);
              const color = UNI_COLORS[i] || UNI_COLORS[0];
              return (
                <div key={u.name} className="flex items-center" style={{ gap: "11px" }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: "30px", height: "30px", borderRadius: "8px", background: color + "18", color, fontSize: "10.5px", fontWeight: 700, flexShrink: 0 }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.name}
                    </div>
                    <div style={{ height: "5px", background: "var(--c-bg-bar-track)", borderRadius: "4px", marginTop: "5px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.round((u.count / uniMax) * 100)}%`, height: "100%", background: color, borderRadius: "5px" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--c-text-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {u.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Pipeline */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
            Application Pipeline
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>{totalApplications} total</span>
        </div>
        {pipelineData.length === 0 ? (
          <div style={{ fontSize: "12.5px", color: "var(--c-text-4)", padding: "20px 0", textAlign: "center" }}>No data yet</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
