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
            "linear-gradient(135deg,var(--color-green-bg),#f2fbf5)",
          border: "1px solid #cdeed8",
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
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--color-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "var(--color-navy)",
              }}
            >
              Recent visa approvals
            </div>
          </div>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 100,
              background: "var(--color-card)",
              border: "1px solid #cdeed8",
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-green)",
            }}
          >
            128 this month
          </span>
        </div>

        {/* Visa grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[14px]"
        >
          {visas.map((v) => (
            <div
              key={v.name}
              style={{
                background: "var(--color-card)",
                borderRadius: 14,
                padding: "14px 16px",
                border: "1px solid #cdeed8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: v.av,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {v.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--color-navy)",
                    }}
                  >
                    {v.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-sub)",
                    }}
                  >
                    {v.dest}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--color-green)",
                  fontWeight: 600,
                }}
              >
                ✓ {v.type} &middot; {v.when}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
