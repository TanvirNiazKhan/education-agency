"use client";

import { FormState } from "../types";

interface ReviewGroup {
  title: string;
  rows: { label: string; value: string }[];
}

interface ReviewStepProps {
  form: FormState;
  reviewGroups: ReviewGroup[];
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export function ReviewStep({ form, reviewGroups, setForm }: ReviewStepProps) {
  return (
    <div>
      {!form.submitted ? (
        <>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--color-navy)",
              margin: "0 0 6px",
            }}
          >
            Review &amp; submit
          </h2>
          <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
            Please review all the information before submitting your application.
          </p>

          {reviewGroups.map((g) => (
            <div key={g.title} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--color-blue)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  padding: "10px 20px",
                  background: "var(--color-blue-x)",
                  borderRadius: "12px 12px 0 0",
                  border: "1px solid var(--color-line)",
                  borderBottom: "none",
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: "0 0 12px 12px",
                  overflow: "hidden",
                }}
              >
                {g.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr]"
                    style={{
                      borderBottom:
                        i < g.rows.length - 1
                          ? "1px solid var(--color-line)"
                          : "none",
                      background: i % 2 === 0 ? "transparent" : "var(--color-line-2)",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--color-sub)",
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        padding: "12px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-ink)",
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Info box */}
          <div
            style={{
              background: "var(--color-blue-x)",
              border: "1px solid var(--color-blue-2)",
              borderRadius: 14,
              padding: "18px 22px",
              marginBottom: 28,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <circle cx="10" cy="10" r="9" stroke="#2563eb" strokeWidth="1.8" />
              <path d="M10 9v5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="10" cy="6.5" r="0.8" fill="#2563eb" />
            </svg>
            <p style={{ fontSize: 13.5, color: "var(--color-sub)", margin: 0, lineHeight: 1.6 }}>
              You can update anything later from your application dashboard. Our
              counsellors will also review your application before it&apos;s sent to the
              university.
            </p>
          </div>

          {/* Submit button */}
          <button
            onClick={() => setForm((f) => ({ ...f, submitted: true }))}
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              background: "linear-gradient(135deg,#0f9d58,#16b364)",
              border: "none",
              borderRadius: 14,
              padding: "16px 48px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Submit application
          </button>
        </>
      ) : (
        /* ── Submitted state ────────────────────────────── */
        <div style={{ textAlign: "center", padding: "50px 0 30px" }}>
          {/* Success animation */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--color-green-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
              <path
                d="M10 18L16 24L26 13"
                stroke="var(--color-green)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-navy)",
              margin: "0 0 8px",
            }}
          >
            Application submitted!
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-sub)",
              margin: "0 0 32px",
              maxWidth: 420,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Your application for {form.course} at {form.institution} has been submitted
            successfully. Our counsellors will review it and get back to you shortly.
          </p>
          <button
            onClick={() => {
              /* navigate to dashboard */
            }}
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              border: "none",
              borderRadius: 12,
              padding: "14px 36px",
              cursor: "pointer",
            }}
          >
            Track my application &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
