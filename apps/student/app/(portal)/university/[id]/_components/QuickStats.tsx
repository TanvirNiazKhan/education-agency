"use client";

interface QuickStatsProps {
  coursesCount: number;
  facultiesCount: number;
  scholarshipsCount: number;
  intakesCount: number;
}

export default function QuickStats({
  coursesCount,
  facultiesCount,
  scholarshipsCount,
  intakesCount,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Courses",
      value: `${coursesCount}`,
      sub: "Available programs",
      color: "var(--color-navy)",
    },
    {
      label: "Faculties",
      value: `${facultiesCount}`,
      sub: "Academic departments",
      color: "var(--color-green)",
    },
    {
      label: "Scholarships",
      value: `${scholarshipsCount}`,
      sub: "Financial aid options",
      color: "var(--color-navy)",
    },
    {
      label: "Intakes",
      value: `${intakesCount}`,
      sub: "Upcoming sessions",
      color: "var(--color-blue)",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 px-4 lg:px-7"
      style={{
        maxWidth: 1160,
        margin: "-14px auto 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-muted)",
              marginBottom: 4,
            }}
          >
            {s.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>
            {s.value}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-sub)",
              marginTop: 2,
            }}
          >
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
