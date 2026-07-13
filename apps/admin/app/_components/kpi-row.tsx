import { DeltaChip } from "@/components/ui";
import { DashboardStats } from "@/lib/api";

interface Props {
  stats: DashboardStats;
}

function buildKpis(stats: DashboardStats) {
  const { totalStudents, totalApplications, statusCounts } = stats;

  const activeApplications = totalApplications -
    (statusCounts.rejected || 0) -
    (statusCounts.withdrawn || 0);

  const pendingReview =
    (statusCounts.submitted || 0) +
    (statusCounts.under_review || 0) +
    (statusCounts.documents_requested || 0);

  const offerLetters =
    (statusCounts.conditional_offer || 0) +
    (statusCounts.unconditional_offer || 0);

  const accepted =
    (statusCounts.accepted || 0) +
    (statusCounts.enrolled || 0);

  return [
    { label: "Total Students", value: totalStudents.toLocaleString() },
    { label: "Active Applications", value: activeApplications.toLocaleString() },
    { label: "Pending Review", value: pendingReview.toLocaleString() },
    { label: "Offer Letters", value: offerLetters.toLocaleString() },
    { label: "Accepted / Enrolled", value: accepted.toLocaleString() },
    { label: "Total Applications", value: totalApplications.toLocaleString() },
  ];
}

export function KpiRow({ stats }: Props) {
  const kpis = buildKpis(stats);

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
        </div>
      ))}
    </div>
  );
}
