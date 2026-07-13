"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";
import { getMyApplications, getStudentProfile } from "../../lib/api";

/* ── Status config ───────────────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; step: number }> = {
  submitted:           { label: "Submitted",          color: "var(--color-blue)", bg: "var(--color-blue-x)",  step: 0 },
  under_review:        { label: "Under Review",        color: "var(--color-amber)", bg: "var(--color-amber-bg)",  step: 2 },
  documents_requested: { label: "Docs Requested",      color: "var(--color-red)", bg: "var(--danger-bg-hover)",  step: 1 },
  conditional_offer:   { label: "Conditional Offer",   color: "var(--color-green)", bg: "var(--color-green-bg)",  step: 5 },
  unconditional_offer: { label: "Unconditional Offer", color: "var(--color-green)", bg: "var(--color-green-bg)",  step: 6 },
  accepted:            { label: "Accepted",            color: "var(--color-green)", bg: "var(--color-green-bg)",  step: 6 },
  enrolled:            { label: "Enrolled",            color: "var(--color-green)", bg: "var(--color-green-bg)",  step: 7 },
  rejected:            { label: "Rejected",            color: "var(--color-red)", bg: "var(--danger-bg-hover)",  step: -1 },
  withdrawn:           { label: "Withdrawn",           color: "var(--color-muted)", bg: "var(--color-line-2)",  step: -1 },
};

const PIPELINE_LABELS = [
  "Submitted", "Docs verified", "Agency review",
  "Sent to uni", "Assessment", "Offer", "Accepted", "Visa",
];

const TOTAL_STEPS = PIPELINE_LABELS.length;

/* ── SVG circle ──────────────────────────────────────────────────── */
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Application {
  id: string;
  status: string;
  university?: { name: string };
  course?: { name: string };
  commence_month?: string;
  commence_year?: string;
  submitted_at?: string;
  documents?: {
    id: string;
    document_type: string;
    file_name: string;
    status: string;
  }[];
}

interface StudentProfile {
  gender?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  passport_no?: string | null;
  mobile?: string | null;
  addresses?: { id: string; type: string }[];
  emergency_contacts?: { id: string }[];
  education?: { id: string }[];
  work_experience?: { id: string }[];
}

/* ── Profile completion calculator ───────────────────────────────── */

function computeProfileCompletion(profile: StudentProfile | null): number {
  if (!profile) return 0;
  const checks = [
    !!profile.gender,
    !!profile.date_of_birth,
    !!profile.nationality,
    !!profile.passport_no,
    !!profile.mobile,
    (profile.addresses?.length || 0) > 0,
    (profile.emergency_contacts?.length || 0) > 0,
    (profile.education?.length || 0) > 0,
    (profile.work_experience?.length || 0) > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

/* ── Document type labels ────────────────────────────────────────── */

const DOC_TYPE_CONFIG: Record<string, { ic: string; tint: string; color: string }> = {
  passport:        { ic: "PP",  tint: "var(--color-blue-x)", color: "var(--color-blue)" },
  academic:        { ic: "TR",  tint: "#f4efff", color: "#7c3aed" },
  english_test:    { ic: "EN",  tint: "#fff1e9", color: "#ea580c" },
  sop:             { ic: "SOP", tint: "var(--color-green-bg)", color: "var(--color-green)" },
  cv:              { ic: "CV",  tint: "#eef2ff", color: "#4f46e5" },
  nid:             { ic: "NID", tint: "var(--color-amber-bg)", color: "var(--color-amber)" },
  guardian_nid:    { ic: "GN",  tint: "var(--danger-bg-hover)", color: "var(--color-red)" },
  course_outlines: { ic: "CO",  tint: "var(--color-blue-x)", color: "var(--color-blue)" },
  gap_explanation: { ic: "GE",  tint: "#f4efff", color: "#7c3aed" },
  spouse_docs:     { ic: "SP",  tint: "#fff1e9", color: "#ea580c" },
};

const DOC_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  academic: "Academic Documents",
  english_test: "IELTS / PTE Score",
  sop: "Statement of Purpose",
  cv: "CV / Résumé",
  nid: "National ID",
  guardian_nid: "Guardian NID",
  course_outlines: "Course Outlines",
  gap_explanation: "Gap Explanation",
  spouse_docs: "Spouse Documents",
};

/* ── Application progress card ───────────────────────────────────── */

function AppProgressCard({ app }: { app: Application }) {
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
  const currentStep = Math.max(0, cfg.step);
  const pct = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);
  const initial = (app.university?.name || "U").charAt(0);

  return (
    <Link
      href="/tracker"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          border: "1.5px solid var(--color-line)",
          background: "var(--color-card)",
          transition: "box-shadow .15s",
        }}
        className="card-hover"
      >
        {/* Row 1: uni + status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg,#0a1330,#16224e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
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
                fontSize: 12,
                color: "var(--color-muted)",
                marginTop: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {app.course?.name || "Course"}
            </div>
          </div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: cfg.color,
              background: cfg.bg,
              padding: "4px 10px",
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              height: 6,
              borderRadius: 10,
              background: "var(--color-line)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: 10,
                background:
                  app.status === "rejected" || app.status === "withdrawn"
                    ? "var(--color-red)"
                    : cfg.step >= 5
                      ? "var(--color-green)"
                      : "var(--color-blue)",
                transition: "width .4s ease",
              }}
            />
          </div>
        </div>

        {/* Step labels */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11.5, color: "var(--color-muted)", fontWeight: 600 }}>
            Step {Math.max(1, currentStep + 1)} of {TOTAL_STEPS}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: cfg.color }}>
            {pct}% complete
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Draft resume banner ─────────────────────────────────────────── */

function DraftBanner() {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    try {
      const draft = localStorage.getItem("odyssey_apply_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        setHasDraft(!!parsed?.institution);
      }
    } catch {}
  }, []);

  if (!hasDraft) return null;

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: "var(--color-amber-bg)",
        border: "1px solid #f5d49a",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-ink)" }}>
          You have an unsaved draft
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}>
          Continue where you left off
        </div>
      </div>
      <Link
        href="/apply"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          background: "var(--color-amber)",
          padding: "8px 16px",
          borderRadius: 10,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Resume →
      </Link>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !token) { setAppsLoading(false); return; }

    Promise.all([
      getMyApplications(token).catch(() => []),
      getStudentProfile(token).catch(() => null),
    ]).then(([apps, prof]: [any, any]) => {
      setApplications(apps || []);
      setProfile(prof);
      setAppsLoading(false);
    });
  }, [token, authLoading]);

  const firstName = user?.first_name || "there";
  const hasApps = applications.length > 0;
  const profilePct = computeProfileCompletion(profile);

  // Collect unique documents from all applications
  const allDocs = applications.flatMap((app) => app.documents || []);
  const docsByType = new Map<string, { type: string; name: string; status: string }>();
  for (const doc of allDocs) {
    // Keep latest per type
    docsByType.set(doc.document_type, {
      type: doc.document_type,
      name: doc.file_name,
      status: doc.status || "uploaded",
    });
  }
  const docEntries = [...docsByType.values()];

  return (
    <main className="px-4 py-6 pb-[120px] md:pb-16 lg:px-7 lg:py-8 lg:pb-[90px]" style={{ maxWidth: 1160, margin: "0 auto" }}>

      {/* ─ Top ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
        {/* Left: welcome */}
        <div>
          <h1 className="text-2xl lg:text-[30px]" style={{ fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-sub)", margin: "6px 0 20px", lineHeight: 1.55 }}>
            {hasApps
              ? `You have ${applications.length} active application${applications.length > 1 ? "s" : ""}. Track progress below.`
              : "Start your study abroad journey. Submit your first application."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5">
            <Link
              href="/apply"
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                borderRadius: 16,
                padding: "20px 22px",
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
              className="lift-hover"
            >
              <span style={{ fontSize: 14.5, fontWeight: 700, opacity: 0.92 }}>
                {hasApps ? "Start new application" : "Begin your application"}
              </span>
              <span style={{ fontSize: 13, opacity: 0.78, marginTop: 8 }}>
                {hasApps ? "Apply to another university →" : "9 steps · takes ~15 mins →"}
              </span>
            </Link>
            <Link
              href="/profile"
              className="w-full sm:w-[150px]"
              style={{
                background: "linear-gradient(135deg,#0a1330,#16224e)",
                borderRadius: 16,
                padding: "20px 18px",
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.92 }}>My profile</span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Save details →</span>
            </Link>
          </div>
        </div>

        {/* Right: profile completion ring */}
        <div
          className="flex flex-row lg:flex-col items-center lg:justify-center gap-4 lg:gap-0 lg:text-center"
          style={{
            background: "var(--color-card)",
            borderRadius: 18,
            boxShadow: "var(--shadow-sm)",
            padding: "28px 24px",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={44} cy={44} r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth={7} />
              <circle
                cx={44} cy={44} r={RADIUS} fill="none"
                stroke={profilePct >= 80 ? "var(--color-green)" : "var(--color-blue)"}
                strokeWidth={7} strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - profilePct / 100)}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: 18,
                fontWeight: 800,
                color: "var(--color-navy)",
              }}
            >
              {profilePct}%
            </span>
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>
              Profile completion
            </span>
            <span style={{ fontSize: 13, color: "var(--color-muted)", margin: "4px 0 12px" }}>
              Complete your profile to get better university matches
            </span>
            <Link href="/profile" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--color-blue)", textDecoration: "none" }}>
              Complete profile →
            </Link>
          </div>
        </div>
      </div>

      {/* ─ Main grid ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Draft banner */}
          <DraftBanner />

          {/* Application progress */}
          <div style={{ background: "var(--color-card)", borderRadius: 18, boxShadow: "var(--shadow-sm)", padding: "24px 26px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>
                Application progress
              </span>
              {hasApps && (
                <Link href="/tracker" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-blue)", textDecoration: "none" }}>
                  Full tracker →
                </Link>
              )}
            </div>

            {appsLoading && (
              <div style={{ color: "var(--color-muted)", fontSize: 14, padding: "8px 0" }}>
                Loading applications...
              </div>
            )}

            {!appsLoading && !hasApps && (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 16 }}>
                  No applications submitted yet.
                </div>
                <Link
                  href="/apply"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#fff",
                    background: "var(--color-blue)",
                    padding: "10px 24px",
                    borderRadius: 10,
                    textDecoration: "none",
                  }}
                >
                  Start applying →
                </Link>
              </div>
            )}

            {!appsLoading && hasApps && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.map((app) => (
                  <AppProgressCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>

          {/* AI Rec */}
          <div style={{ background: "linear-gradient(135deg,#0a1330,#16224e)", borderRadius: 18, padding: "26px 28px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.35),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>⭐</span>
              <span style={{ fontSize: 15, fontWeight: 800 }}>AI recommendation</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.88, margin: "0 0 18px" }}>
              Complete your profile and submit an application to get personalized university recommendations from our AI counsellor.
            </p>
            <Link href="/chat" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700, color: "#0a1330", background: "#fff", padding: "9px 18px", borderRadius: 10, textDecoration: "none" }} className="lift-hover">
              Talk to AI counsellor →
            </Link>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Document center */}
          <div style={{ background: "var(--color-card)", borderRadius: 18, boxShadow: "var(--shadow-sm)", padding: "24px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>Document center</span>
              {hasApps && (
                <Link href="/documents" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-blue)", textDecoration: "none" }}>Open →</Link>
              )}
            </div>
            {docEntries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13.5, color: "var(--color-muted)" }}>
                {hasApps ? "No documents uploaded yet." : "Submit an application to start uploading documents."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {docEntries.map((d) => {
                  const cfg = DOC_TYPE_CONFIG[d.type] || { ic: d.type.slice(0, 2).toUpperCase(), tint: "var(--color-line-2)", color: "var(--color-muted)" };
                  const statusColor = d.status === "verified" ? "var(--color-green)" : d.status === "rejected" ? "var(--color-red)" : "var(--color-blue)";
                  const statusBg = d.status === "verified" ? "var(--color-green-bg)" : d.status === "rejected" ? "var(--danger-bg-hover)" : "var(--color-blue-x)";
                  const statusLabel = d.status.charAt(0).toUpperCase() + d.status.slice(1);
                  return (
                    <div key={d.type} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: cfg.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: cfg.color, flexShrink: 0 }}>{cfg.ic}</div>
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {DOC_TYPE_LABELS[d.type] || d.type}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: statusColor, background: statusBg, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>{statusLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Application summary */}
          {hasApps && (
            <div style={{ background: "var(--color-card)", borderRadius: 18, boxShadow: "var(--shadow-sm)", padding: "24px 22px" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)", display: "block", marginBottom: 16 }}>Application summary</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.map((app) => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                  return (
                    <div key={app.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0, marginTop: 6 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {app.university?.name || "University"}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}>
                          {app.course?.name || "Course"} · {cfg.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
