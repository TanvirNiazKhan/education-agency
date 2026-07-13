"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";
import { getMyApplications } from "../../lib/api";

/* ── Status → step index mapping ─────────────────────────────────── */

const STATUS_STEP: Record<string, number> = {
  submitted: 0,
  under_review: 2,
  documents_requested: 1,
  conditional_offer: 5,
  unconditional_offer: 6,
  accepted: 6,
  enrolled: 7,
  rejected: -1,
  withdrawn: -1,
};

const PIPELINE = [
  {
    label: "Application submitted",
    desc: "Your application has been received and is being processed by our team.",
  },
  {
    label: "Documents verified",
    desc: "All uploaded documents have been reviewed and verified by our counsellors.",
  },
  {
    label: "Agency review",
    desc: "Our counsellors are reviewing your application and preparing it for submission.",
  },
  {
    label: "Submitted to university",
    desc: "Your application has been officially submitted to the university admissions portal.",
  },
  {
    label: "University assessment",
    desc: "The university is reviewing your application. Average processing time is 4–6 weeks.",
  },
  {
    label: "Conditional offer",
    desc: "Congratulations! You received a conditional offer. Check the conditions and respond.",
  },
  {
    label: "Offer accepted",
    desc: "You have accepted the offer. CoE will be issued within 5 business days.",
  },
  {
    label: "Visa application",
    desc: "Once your CoE is issued, we'll guide you through the student visa application.",
  },
];

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  submitted:           { label: "Submitted",          color: "#2563eb", bg: "#eff4ff" },
  under_review:        { label: "Under Review",        color: "#e08a1e", bg: "#fdf3e6" },
  documents_requested: { label: "Docs Requested",      color: "#e0492e", bg: "#fef2f2" },
  conditional_offer:   { label: "Conditional Offer",   color: "#0f9d58", bg: "#e9f9ef" },
  unconditional_offer: { label: "Unconditional Offer", color: "#0f9d58", bg: "#e9f9ef" },
  accepted:            { label: "Accepted",            color: "#0f9d58", bg: "#e9f9ef" },
  enrolled:            { label: "Enrolled",            color: "#0f9d58", bg: "#e9f9ef" },
  rejected:            { label: "Rejected",            color: "#e0492e", bg: "#fef2f2" },
  withdrawn:           { label: "Withdrawn",           color: "#8592ad", bg: "#f1f3f8" },
};

interface Application {
  id: string;
  status: string;
  submitted_at: string;
  commence_month?: string;
  commence_year?: string;
  university?: { name: string };
  course?: { name: string };
}

/* ── Tracker timeline ─────────────────────────────────────────────── */

function TrackerTimeline({ app }: { app: Application }) {
  const currentStep = STATUS_STEP[app.status] ?? 0;
  const isTerminal = app.status === "rejected" || app.status === "withdrawn";
  const badge = STATUS_LABEL[app.status];

  return (
    <div
      style={{
        background: "var(--color-card)",
        borderRadius: 20,
        border: "1px solid var(--color-line)",
        overflow: "hidden",
      }}
    >
      {/* Summary header */}
      <div
        style={{
          background: "linear-gradient(135deg,#0a1330,#16224e)",
          padding: "20px 24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#2563eb,#60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {(app.university?.name || "U").charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 2 }}>
            {app.university?.name || "University"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>
            {app.course?.name || "Course"}{" "}
            {app.commence_month && app.commence_year
              ? `· ${app.commence_month} ${app.commence_year}`
              : ""}
          </div>
        </div>
        {badge && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: badge.color,
              background: "rgba(255,255,255,.12)",
              padding: "6px 14px",
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Terminal state */}
      {isTerminal && (
        <div
          style={{
            padding: "20px 24px",
            background: "#fef2f2",
            borderBottom: "1px solid #fecaca",
            color: "#e0492e",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          This application was {app.status}. Contact your counsellor for next steps.
        </div>
      )}

      {/* Timeline */}
      {!isTerminal && (
        <div style={{ padding: "24px 24px 20px" }}>
          {PIPELINE.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            const isLast = i === PIPELINE.length - 1;

            return (
              <div key={i} style={{ display: "flex", gap: 18 }}>
                {/* Dot + line */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 34,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      ...(isDone
                        ? { background: "var(--color-green)" }
                        : isCurrent
                          ? { background: "var(--color-blue)" }
                          : {
                              background: "#fff",
                              border: "2.5px solid var(--color-line)",
                            }),
                    }}
                    className={isCurrent ? "animate-ring" : undefined}
                  >
                    {isDone && (
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isCurrent && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 2.5,
                        flex: 1,
                        minHeight: 20,
                        background: isDone ? "var(--color-green)" : "var(--color-line)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
                  <div
                    style={{
                      background: isCurrent ? "rgba(37,99,235,.06)" : isDone ? "var(--color-card)" : "var(--color-bg)",
                      border: isCurrent ? "1.5px solid rgba(37,99,235,.22)" : "1.5px solid transparent",
                      borderRadius: 14,
                      padding: "14px 18px",
                      opacity: isDone || isCurrent ? 1 : 0.45,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: isCurrent ? "var(--color-blue)" : isDone ? "var(--color-ink)" : "var(--color-muted)",
                        }}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "var(--color-blue)",
                            background: "var(--color-blue-x)",
                            padding: "3px 9px",
                            borderRadius: 8,
                          }}
                        >
                          Current
                        </span>
                      )}
                      {isDone && (
                        <span style={{ fontSize: 12, color: "var(--color-green)", fontWeight: 600 }}>
                          Done
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--color-sub)", margin: 0, lineHeight: 1.55 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Application card (list view) ────────────────────────────────── */

function AppCard({
  app,
  selected,
  onClick,
}: {
  app: Application;
  selected: boolean;
  onClick: () => void;
}) {
  const badge = STATUS_LABEL[app.status];
  const initial = (app.university?.name || "U").charAt(0);
  const submittedDate = app.submitted_at
    ? new Date(app.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: selected ? "var(--color-blue-x)" : "var(--color-card)",
        border: selected ? "1.5px solid var(--color-blue-2)" : "1.5px solid var(--color-line)",
        borderRadius: 16,
        padding: "16px 18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all .15s",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: selected
            ? "linear-gradient(135deg,#2563eb,#4f7bff)"
            : "linear-gradient(135deg,#0a1330,#16224e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "var(--color-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {app.university?.name || "University"}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--color-muted)",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {app.course?.name || "Course"} · {submittedDate}
        </div>
      </div>
      {badge && (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: badge.color,
            background: badge.bg,
            padding: "4px 10px",
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          {badge.label}
        </span>
      )}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */

export default function TrackerPage() {
  const { token, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }
    getMyApplications(token)
      .then((apps: any) => {
        setApplications(apps);
        if (apps.length > 0) setSelectedId(apps[0].id);
      })
      .catch((err: any) => setError(err.message || "Failed to load applications"))
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const selected = applications.find((a) => a.id === selectedId) || null;
  const multiApp = applications.length > 1;

  return (
    <main
      className="px-4 py-6 pb-[120px] md:pb-16 lg:px-7 lg:py-8 lg:pb-[90px]"
      style={{ maxWidth: 1000, margin: "0 auto" }}
    >
      {/* Header */}
      <h1
        className="text-2xl lg:text-[30px]"
        style={{ fontWeight: 800, color: "var(--color-navy)", margin: 0 }}
      >
        Application tracker
      </h1>
      <p style={{ fontSize: 15, color: "var(--color-sub)", margin: "6px 0 24px", lineHeight: 1.55 }}>
        Track every step of your application — from submission to visa.
      </p>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)", fontSize: 15 }}>
          Loading applications...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "var(--color-red)",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* Not logged in */}
      {!loading && !token && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--color-muted)",
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Sign in to view your applications</p>
          <Link
            href="/login"
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: "#fff",
              background: "var(--color-blue)",
              padding: "12px 28px",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </div>
      )}

      {/* No applications */}
      {!loading && token && applications.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            background: "var(--color-card)",
            borderRadius: 20,
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--color-blue-x)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M12 18v-6M9 15h6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 8px" }}>
            No applications yet
          </p>
          <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "0 0 24px" }}>
            Submit your first application to start tracking its progress.
          </p>
          <Link
            href="/apply"
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              padding: "13px 30px",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Start application &rarr;
          </Link>
        </div>
      )}

      {/* Content */}
      {!loading && applications.length > 0 && (
        <div
          className={multiApp ? "grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6" : ""}
        >
          {/* Application list (only if multiple) */}
          {multiApp && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                {applications.length} Applications
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {applications.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    selected={app.id === selectedId}
                    onClick={() => setSelectedId(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tracker timeline */}
          <div>
            {selected && <TrackerTimeline app={selected} />}

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row gap-3.5" style={{ marginTop: 20 }}>
              <Link
                href="/chat"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "var(--color-blue-d)",
                  background: "var(--color-blue-x)",
                  border: "1.5px solid var(--color-blue-2)",
                  borderRadius: 14,
                  padding: "14px 20px",
                  textDecoration: "none",
                }}
                className="chip-hover"
              >
                ✦ Ask AI about my application
              </Link>
              <Link
                href="/apply"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "#fff",
                  background: "var(--color-blue)",
                  borderRadius: 14,
                  padding: "14px 20px",
                  textDecoration: "none",
                  border: "none",
                }}
                className="lift-hover"
              >
                + New application
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
