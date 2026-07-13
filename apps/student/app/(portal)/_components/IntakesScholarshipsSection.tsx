import type { Intake, Scholarship } from "../../lib/data";

interface IntakesScholarshipsSectionProps {
  intakes: Intake[];
  scholarships: Scholarship[];
}

export default function IntakesScholarshipsSection({ intakes, scholarships }: IntakesScholarshipsSectionProps) {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6"
      style={{
        marginTop: 52,
      }}
    >
      {/* Intakes */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--color-navy)",
            marginBottom: 18,
          }}
        >
          Upcoming intakes
        </h2>
        <div
          style={{
            background: "var(--color-card)",
            borderRadius: 18,
            border: "1px solid var(--color-line)",
            overflow: "hidden",
          }}
        >
          {intakes.map((ink, i) => (
            <div
              key={ink.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                borderTop:
                  i > 0 ? "1px solid var(--color-line)" : "none",
              }}
            >
              {/* Date badge */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--color-line-2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  {ink.mon}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    lineHeight: 1,
                  }}
                >
                  {ink.day}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: "var(--color-navy)",
                  }}
                >
                  {ink.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-sub)",
                    marginTop: 2,
                  }}
                >
                  {ink.sub}
                </div>
              </div>

              {/* Tag */}
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: ink.tagBg,
                  color: ink.tagColor,
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {ink.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarships */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--color-navy)",
            marginBottom: 18,
          }}
        >
          Scholarship opportunities
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scholarships.map((s) => (
            <div
              key={s.name}
              style={{
                background: "var(--color-card)",
                borderRadius: 16,
                border: "1px solid var(--color-line)",
                padding: "18px 20px",
                borderLeft: "4px solid var(--color-green)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  marginBottom: 4,
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-sub)",
                  marginBottom: 10,
                }}
              >
                {s.uni} &middot; {s.who}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--color-green)",
                  }}
                >
                  {s.amount}
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-muted)",
                  }}
                >
                  Deadline: {s.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
