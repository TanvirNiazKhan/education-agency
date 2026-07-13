"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { applicationsApi, AdminApplication } from "@/lib/api";
import { stageColors, STATUS_LABELS, STATUS_PROGRESS } from "../_data/constants";
import { DocumentPreviewModal } from "./document-preview-modal";

interface Props {
  applicationId: string | null;
  onClose: () => void;
}

function Badge({ status }: { status: string }) {
  const color = stageColors[status] || "#a1a1aa";
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        background: color + "18",
        color,
      }}
    >
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13.5px", color: "var(--c-text-1)", fontWeight: 450 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px", paddingBottom: "8px", borderBottom: "1px solid var(--c-border)" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </div>
  );
}

const DOC_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  english_cert: "English Certificate",
  transcripts: "Academic Transcripts",
  financial_proof: "Financial Proof",
  cv: "CV / Resume",
  reference_letter: "Reference Letter",
  statement_of_purpose: "Statement of Purpose",
  nid: "National ID",
  work_permit: "Work Permit",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ApplicationDrawer({ applicationId, onClose }: Props) {
  const [app, setApp] = useState<AdminApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<AdminApplication["documents"][0] | null>(null);

  useEffect(() => {
    if (!applicationId) { setApp(null); return; }
    setLoading(true);
    setError(null);
    applicationsApi.getById(applicationId)
      .then(setApp)
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const open = !!applicationId;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const progress = app ? STATUS_PROGRESS[app.status] ?? 0 : 0;

  return (
    <>
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          background: "var(--c-bg-elevated)",
          borderLeft: "1px solid var(--c-border)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.12)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid var(--c-border)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--c-border)",
              borderRadius: "8px",
              background: "var(--c-bg-surface)",
              cursor: "pointer",
              color: "var(--c-text-2)",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "15px", fontWeight: 650, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
              Application Detail
            </div>
            {app && (
              <div style={{ fontSize: "12px", color: "var(--c-text-4)", marginTop: "1px" }}>
                #{app.id.slice(0, 8).toUpperCase()}
              </div>
            )}
          </div>
          {app && <Badge status={app.status} />}
          {app && (
            <Link
              href={`/applications/${app.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--c-text-2)",
                background: "var(--c-bg-surface)",
                border: "1px solid var(--c-border)",
                borderRadius: "8px",
                padding: "5px 10px",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Full view
            </Link>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--c-text-4)", fontSize: "14px" }}>
              Loading…
            </div>
          )}

          {error && (
            <div style={{ padding: "16px", borderRadius: "10px", background: "#fef2f2", color: "#dc2626", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {app && !loading && (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--c-text-4)", fontWeight: 500 }}>Application progress</span>
                  <span style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 650, fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--c-bg-progress-track)", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: stageColors[app.status] || "#2563eb", borderRadius: "6px", transition: "width 0.4s" }} />
                </div>
              </div>

              {/* Student */}
              <Section title="Student">
                <Field label="Name" value={`${app.student?.user?.first_name} ${app.student?.user?.last_name}`} />
                <Field label="Email" value={app.student?.user?.email} />
                <Field label="Phone" value={app.student?.user?.phone} />
                <Field label="Nationality" value={app.student?.nationality} />
                <Field label="Passport No." value={app.student?.passport_no} />
              </Section>

              {/* Program */}
              <Section title="Program">
                <Field label="University" value={app.university?.name} />
                <Field label="Country" value={app.university?.country?.name} />
                <Field label="Faculty" value={app.course?.faculty?.name} />
                <Field label="Course" value={app.course?.name} />
                <Field label="Course Code" value={app.course?.course_code} />
                <Field label="Intake" value={[app.commence_month, app.commence_year].filter(Boolean).join(" ") || null} />
                <Field label="Campus" value={app.campus} />
                <Field label="Study Location" value={app.study_location} />
                <Field label="Student Type" value={app.student_type} />
                <Field label="Enrolment Type" value={app.enrolment_type} />
                <Field label="Application Type" value={app.application_type} />
                <Field label="Submitted" value={formatDate(app.submitted_at)} />
              </Section>

              {/* Documents */}
              <Section title={`Documents (${app.documents?.length ?? 0})`}>
                {app.documents?.length === 0 && (
                  <div style={{ fontSize: "13px", color: "var(--c-text-4)" }}>No documents uploaded</div>
                )}
                {app.documents?.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--c-border)",
                      background: "var(--c-bg-surface)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {doc.file_name}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: doc.status === "approved" ? "#dcfce7" : doc.status === "rejected" ? "#fef2f2" : "#f1f5f9",
                        color: doc.status === "approved" ? "#15803d" : doc.status === "rejected" ? "#dc2626" : "#64748b",
                        flexShrink: 0,
                      }}
                    >
                      {doc.status}
                    </span>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      title="Preview"
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--c-border)",
                        borderRadius: "7px",
                        background: "var(--c-bg-elevated)",
                        cursor: "pointer",
                        color: "var(--c-text-2)",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </Section>

              {/* Status History */}
              {app.status_history && app.status_history.length > 0 && (
                <Section title="Status Timeline">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {[...app.status_history]
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((h, i) => (
                        <div key={h.id} style={{ display: "flex", gap: "12px", paddingBottom: i < app.status_history!.length - 1 ? "16px" : "0" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: stageColors[h.to_status] || "#a1a1aa",
                              marginTop: "4px",
                              flexShrink: 0,
                            }} />
                            {i < app.status_history!.length - 1 && (
                              <div style={{ width: "1px", flex: 1, background: "var(--c-border)", marginTop: "4px" }} />
                            )}
                          </div>
                          <div style={{ paddingBottom: "4px" }}>
                            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-1)" }}>
                              {STATUS_LABELS[h.to_status] || h.to_status}
                            </div>
                            {h.comment && (
                              <div style={{ fontSize: "12px", color: "var(--c-text-3)", marginTop: "2px" }}>{h.comment}</div>
                            )}
                            <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "2px" }}>
                              {formatDate(h.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Section>
              )}

              {/* Notes */}
              {app.notes && (
                <Section title="Notes">
                  <p style={{ fontSize: "13.5px", color: "var(--c-text-2)", lineHeight: 1.6, margin: 0 }}>{app.notes}</p>
                </Section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
