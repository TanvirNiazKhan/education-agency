import type { VisaApproval } from "../../lib/data";

interface VisaApprovalsSectionProps {
  visas: VisaApproval[];
}

export default function VisaApprovalsSection({ visas }: VisaApprovalsSectionProps) {
  return (
    <section style={{ marginTop: 52 }}>
      <div
        className="px-4 py-[18px] md:px-[26px] md:py-6"
        style={{
          background:
            "linear-gradient(135deg,var(--color-green-bg),var(--green-grad-end))",
          border: "1px solid var(--green-line)",
          borderRadius: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Green check icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background:
                "linear-gradient(135deg,var(--color-green),var(--color-green-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px -4px rgba(15,157,88,.5)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "var(--color-navy)",
              }}
            >
              Recent visa approvals
            </div>
            <div
              className="hidden md:block"
              style={{
                fontSize: 13,
                color: "var(--color-sub)",
                marginTop: 1,
              }}
            >
              Real students, real results — updated weekly
            </div>
          </div>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 100,
              background: "var(--color-card)",
              border: "1px solid var(--green-line)",
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-green)",
              flexShrink: 0,
            }}
          >
            128 this month
          </span>
        </div>

        {/* Visa grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[14px]">
          {visas.map((v) => (
            <div
              key={v.name}
              className="lift-hover"
              style={{
                background: "var(--color-card)",
                borderRadius: 14,
                padding: "16px",
                border: "1px solid var(--green-line)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: v.av,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12.5,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {v.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--color-navy)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-sub)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.dest}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "var(--color-green-bg)",
                    color: "var(--color-green)",
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {v.type}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    color: "var(--color-muted)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {v.when}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
