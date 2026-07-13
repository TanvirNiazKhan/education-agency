"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  applicationsApi,
  AdminApplication,
  UpdateApplicationData,
  APPLICATION_STATUSES,
} from "@/lib/api";
import { stageColors, STATUS_LABELS, STATUS_PROGRESS } from "../_data/constants";
import { DocumentPreviewModal } from "../_components/document-preview-modal";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

// ── sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const color = stageColors[status] || "#a1a1aa";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "12.5px",
        fontWeight: 650,
        padding: "4px 12px",
        borderRadius: "20px",
        background: color + "18",
        color,
      }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--c-bg-elevated)",
        border: "1px solid var(--c-border)",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--c-border)",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 650, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-field-grid">
      {children}
    </div>
  );
}

function ReadField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13.5px", color: value ? "var(--c-text-1)" : "var(--c-text-4)", fontWeight: 450 }}>
        {value || "—"}
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          fontSize: "13.5px",
          color: "var(--c-text-1)",
          background: "var(--c-bg-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "8px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── status change modal ───────────────────────────────────────────────────────

function StatusModal({
  current,
  onSave,
  onClose,
}: {
  current: string;
  onSave: (status: string, comment: string) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(current);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.3)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="status-modal-box">
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--c-text-1)", marginBottom: "18px" }}>
          Change Status
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13.5px",
              color: "var(--c-text-1)",
              background: "var(--c-bg-surface)",
              border: "1px solid var(--c-border)",
              borderRadius: "9px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a note about this status change…"
            rows={3}
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13.5px",
              color: "var(--c-text-1)",
              background: "var(--c-bg-surface)",
              border: "1px solid var(--c-border)",
              borderRadius: "9px",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--c-text-2)",
              background: "var(--c-bg-surface)",
              border: "1px solid var(--c-border)",
              borderRadius: "9px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status, comment)}
            disabled={status === current}
            style={{
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 650,
              color: "#fff",
              background: status === current ? "#94a3b8" : "#2563eb",
              border: "none",
              borderRadius: "9px",
              cursor: status === current ? "not-allowed" : "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [app, setApp] = useState<AdminApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UpdateApplicationData>({});

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<AdminApplication["documents"][0] | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    applicationsApi.getById(id)
      .then((data) => {
        setApp(data);
        setForm({
          campus: data.campus ?? "",
          application_type: data.application_type ?? "",
          study_location: data.study_location ?? "",
          student_type: data.student_type ?? "",
          enrolment_type: data.enrolment_type ?? "",
          commence_month: data.commence_month ?? "",
          commence_year: data.commence_year ?? "",
          notes: data.notes ?? "",
        });
      })
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await applicationsApi.update(id, form);
      setApp(updated);
      setEditing(false);
    } catch (e: any) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (!app) return;
    setForm({
      campus: app.campus ?? "",
      application_type: app.application_type ?? "",
      study_location: app.study_location ?? "",
      student_type: app.student_type ?? "",
      enrolment_type: app.enrolment_type ?? "",
      commence_month: app.commence_month ?? "",
      commence_year: app.commence_year ?? "",
      notes: app.notes ?? "",
    });
    setEditing(false);
  }

  async function handleStatusSave(status: string, comment: string) {
    setStatusSaving(true);
    setShowStatusModal(false);
    try {
      const updated = await applicationsApi.changeStatus(id, status, comment || undefined);
      setApp(updated);
    } catch (e: any) {
      alert(e.message || "Status change failed");
    } finally {
      setStatusSaving(false);
    }
  }

  const progress = app ? STATUS_PROGRESS[app.status] ?? 0 : 0;
  const statusColor = app ? (stageColors[app.status] || "#a1a1aa") : "#a1a1aa";
  const studentName = app
    ? `${app.student?.user?.first_name ?? ""} ${app.student?.user?.last_name ?? ""}`.trim()
    : "";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--c-text-4)", fontSize: "14px" }}>
        Loading…
      </div>
    );
  }

  if (error || !app) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px" }}>
        <div style={{ color: "#dc2626", fontSize: "14px" }}>{error || "Application not found"}</div>
        <button onClick={() => router.back()} style={{ fontSize: "13px", color: "var(--c-text-2)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .app-detail-topbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; }
        .app-detail-title { flex: 1; min-width: 0; }
        .app-detail-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .app-detail-body { flex: 1; overflow-y: auto; padding: 16px; }
        .app-detail-cols { display: grid; grid-template-columns: 1fr 360px; gap: 16px; align-items: start; }
        .app-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; }
        .status-modal-box { background: var(--c-bg-elevated); border: 1px solid var(--c-border); border-radius: 16px; padding: 24px; width: min(400px, calc(100vw - 32px)); box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        @media (max-width: 768px) {
          .app-detail-topbar { padding: 10px 12px; gap: 8px; }
          .app-detail-body { padding: 12px; }
          .app-detail-cols { grid-template-columns: 1fr; }
          .app-field-grid { grid-template-columns: 1fr; gap: 12px; }
          .app-detail-title div:first-child { font-size: 14px; }
          .app-detail-title div:last-child { font-size: 11px; }
        }
        @media (max-width: 480px) {
          .app-detail-actions button span.btn-label { display: none; }
        }
      `}</style>

      {showStatusModal && (
        <StatusModal
          current={app.status}
          onSave={handleStatusSave}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Top bar */}
        <div
          className="app-detail-topbar"
          style={{
            borderBottom: "1px solid var(--c-border)",
            background: "var(--c-bg-elevated)",
            flexShrink: 0,
          }}
        >
          <Link
            href="/applications"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "var(--c-text-3)",
              textDecoration: "none",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid var(--c-border)",
              background: "var(--c-bg-surface)",
              fontWeight: 500,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Applications
          </Link>

          <div className="app-detail-title">
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--c-text-1)", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {studentName}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              #{id.slice(0, 8).toUpperCase()} · {app.university?.name}
            </div>
          </div>

          <div className="app-detail-actions">
          <StatusBadge status={app.status} />

          <button
            onClick={() => setShowStatusModal(true)}
            disabled={statusSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: 650,
              color: statusColor,
              background: statusColor + "15",
              border: `1px solid ${statusColor}40`,
              borderRadius: "9px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span className="btn-label">{statusSaving ? "Saving…" : "Change Status"}</span>
          </button>

          {editing ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--c-text-2)",
                  background: "var(--c-bg-surface)",
                  border: "1px solid var(--c-border)",
                  borderRadius: "9px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 650,
                  color: "#fff",
                  background: saving ? "#94a3b8" : "#2563eb",
                  border: "none",
                  borderRadius: "9px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 650,
                color: "var(--c-text-1)",
                background: "var(--c-bg-surface)",
                border: "1px solid var(--c-border)",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          )}
          </div>{/* end .app-detail-actions */}
        </div>

        {/* Body */}
        <div className="app-detail-body" style={{ flex: 1, overflowY: "auto" }}>
          {/* Progress bar */}
          <div
            style={{
              background: "var(--c-bg-elevated)",
              border: "1px solid var(--c-border)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-2)" }}>Application Progress</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: statusColor, fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
            </div>
            <div style={{ height: "7px", background: "var(--c-bg-progress-track)", borderRadius: "7px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: statusColor, borderRadius: "7px", transition: "width 0.4s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Submitted {formatDateShort(app.submitted_at)}</span>
              <span style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Last updated {formatDateShort(app.created_at)}</span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="app-detail-cols">
            {/* LEFT */}
            <div>
              {/* Student info */}
              <SectionCard title="Student Information">
                <FieldGrid>
                  <ReadField label="Full Name" value={studentName} />
                  <ReadField label="Email" value={app.student?.user?.email} />
                  <ReadField label="Phone" value={app.student?.user?.phone} />
                  <ReadField label="Gender" value={app.student?.gender} />
                  <ReadField label="Date of Birth" value={app.student?.date_of_birth} />
                  <ReadField label="Marital Status" value={app.student?.marital_status} />
                  <ReadField label="Mobile" value={app.student?.mobile} />
                  <ReadField label="Skype" value={app.student?.skype} />
                </FieldGrid>
              </SectionCard>

              {/* Passport */}
              <SectionCard title="Passport / ID">
                <FieldGrid>
                  <ReadField label="Nationality" value={app.student?.nationality} />
                  <ReadField label="Passport No." value={app.student?.passport_no} />
                  <ReadField label="Issue Date" value={app.student?.passport_issue_date} />
                  <ReadField label="Expiry Date" value={app.student?.passport_expiry_date} />
                  <ReadField label="Issue Place" value={app.student?.passport_issue_place} />
                  <ReadField label="Birth Place" value={app.student?.passport_birth_place} />
                  <ReadField label="Visa Refused" value={app.student?.visa_refused ? "Yes" : "No"} />
                </FieldGrid>
              </SectionCard>

              {/* Addresses */}
              {app.student?.addresses?.map((addr) => (
                <SectionCard key={addr.id} title={`Address — ${addr.type === "current" ? "Current" : "Permanent"}`}>
                  <FieldGrid>
                    <ReadField label="Street" value={addr.street} />
                    <ReadField label="Apt / Unit" value={addr.apt} />
                    <ReadField label="City" value={addr.city} />
                    <ReadField label="State" value={addr.state} />
                    <ReadField label="Postcode" value={addr.postcode} />
                    <ReadField label="Country" value={addr.country} />
                  </FieldGrid>
                </SectionCard>
              ))}

              {/* Emergency contacts */}
              {app.student?.emergency_contacts?.map((ec, i) => (
                <SectionCard key={ec.id} title={`Emergency Contact${app.student.emergency_contacts.length > 1 ? ` ${i + 1}` : ""}`}>
                  <FieldGrid>
                    <ReadField label="Name" value={[ec.first_name, ec.last_name].filter(Boolean).join(" ")} />
                    <ReadField label="Relationship" value={ec.relationship} />
                    <ReadField label="Mobile" value={ec.mobile} />
                    <ReadField label="Other Phone" value={ec.other_phone} />
                    <ReadField label="Email" value={ec.email} />
                  </FieldGrid>
                </SectionCard>
              ))}

              {/* Education */}
              {app.student?.education?.map((edu, i) => (
                <SectionCard key={edu.id} title={`Education${app.student.education.length > 1 ? ` ${i + 1}` : ""}`}>
                  <FieldGrid>
                    <ReadField label="Level" value={edu.level} />
                    <ReadField label="Completion Year" value={edu.completion_year} />
                    <ReadField label="English Test" value={edu.english_test_type} />
                    <ReadField label="Test Date" value={edu.english_test_date} />
                    <ReadField label="Overall Score" value={edu.score_overall?.toString()} />
                    <ReadField label="Reading" value={edu.score_reading?.toString()} />
                    <ReadField label="Listening" value={edu.score_listening?.toString()} />
                    <ReadField label="Writing" value={edu.score_writing?.toString()} />
                    <ReadField label="Speaking" value={edu.score_speaking?.toString()} />
                  </FieldGrid>
                </SectionCard>
              ))}

              {/* Work experience */}
              {app.student?.work_experience?.map((we, i) => (
                <SectionCard key={we.id} title={`Work Experience${app.student.work_experience.length > 1 ? ` ${i + 1}` : ""}`}>
                  <FieldGrid>
                    <ReadField label="Employer" value={we.employer} />
                    <ReadField label="Manager" value={we.manager} />
                    <ReadField label="Start Date" value={we.start_date} />
                    <ReadField label="End Date" value={we.end_date} />
                    <ReadField label="Professional Membership" value={we.professional_membership} />
                  </FieldGrid>
                </SectionCard>
              ))}

              {/* Program info */}
              <SectionCard title="Program Details">
                <FieldGrid>
                  <ReadField label="University" value={app.university?.name} />
                  <ReadField label="Country" value={app.university?.country?.name} />
                  <ReadField label="Faculty" value={app.course?.faculty?.name} />
                  <ReadField label="Course" value={app.course?.name} />
                  <ReadField label="Course Code" value={app.course?.course_code} />

                  {editing ? (
                    <>
                      <EditField label="Commence Month" value={form.commence_month ?? ""} onChange={(v) => setForm((f) => ({ ...f, commence_month: v }))} />
                      <EditField label="Commence Year" value={form.commence_year ?? ""} onChange={(v) => setForm((f) => ({ ...f, commence_year: v }))} />
                      <EditField label="Campus" value={form.campus ?? ""} onChange={(v) => setForm((f) => ({ ...f, campus: v }))} />
                      <EditField label="Application Type" value={form.application_type ?? ""} onChange={(v) => setForm((f) => ({ ...f, application_type: v }))} />
                      <EditField label="Study Location" value={form.study_location ?? ""} onChange={(v) => setForm((f) => ({ ...f, study_location: v }))} />
                      <EditField label="Student Type" value={form.student_type ?? ""} onChange={(v) => setForm((f) => ({ ...f, student_type: v }))} />
                      <EditField label="Enrolment Type" value={form.enrolment_type ?? ""} onChange={(v) => setForm((f) => ({ ...f, enrolment_type: v }))} />
                    </>
                  ) : (
                    <>
                      <ReadField label="Intake" value={[app.commence_month, app.commence_year].filter(Boolean).join(" ") || null} />
                      <ReadField label="Campus" value={app.campus} />
                      <ReadField label="Application Type" value={app.application_type} />
                      <ReadField label="Study Location" value={app.study_location} />
                      <ReadField label="Student Type" value={app.student_type} />
                      <ReadField label="Enrolment Type" value={app.enrolment_type} />
                    </>
                  )}
                </FieldGrid>
              </SectionCard>

              {/* Notes */}
              <SectionCard title="Notes">
                {editing ? (
                  <textarea
                    value={form.notes ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Add notes about this application…"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13.5px",
                      color: "var(--c-text-1)",
                      background: "var(--c-bg-surface)",
                      border: "1px solid var(--c-border)",
                      borderRadius: "9px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      lineHeight: 1.6,
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "13.5px", color: app.notes ? "var(--c-text-1)" : "var(--c-text-4)", lineHeight: 1.7, margin: 0 }}>
                    {app.notes || "No notes added."}
                  </p>
                )}
              </SectionCard>
            </div>

            {/* RIGHT */}
            <div>
              {/* Documents */}
              <SectionCard title={`Documents · ${app.documents?.length ?? 0}`}>
                {!app.documents?.length ? (
                  <div style={{ fontSize: "13px", color: "var(--c-text-4)", textAlign: "center", padding: "16px 0" }}>
                    No documents uploaded yet
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {app.documents.map((doc) => {
                      const docColor =
                        doc.status === "approved" ? "#15803d" :
                        doc.status === "rejected" ? "#dc2626" : "#64748b";
                      return (
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
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: "var(--c-bg-panel)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "12.5px", fontWeight: 650, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {doc.file_name}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 650,
                              padding: "2.5px 8px",
                              borderRadius: "10px",
                              background: docColor + "18",
                              color: docColor,
                              textTransform: "capitalize",
                              flexShrink: 0,
                            }}
                          >
                            {doc.status}
                          </span>
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            title="Preview"
                            style={{
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid var(--c-border)",
                              borderRadius: "8px",
                              background: "var(--c-bg-elevated)",
                              cursor: "pointer",
                              color: "var(--c-text-2)",
                              flexShrink: 0,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>

              {/* Status Timeline */}
              <SectionCard title="Status Timeline">
                {!app.status_history?.length ? (
                  <div style={{ fontSize: "13px", color: "var(--c-text-4)" }}>No history</div>
                ) : (
                  <div>
                    {[...app.status_history]
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((h, i, arr) => {
                        const color = stageColors[h.to_status] || "#a1a1aa";
                        return (
                          <div key={h.id} style={{ display: "flex", gap: "12px", paddingBottom: i < arr.length - 1 ? "18px" : "0" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "20px" }}>
                              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, marginTop: "3px", flexShrink: 0, boxShadow: `0 0 0 3px ${color}22` }} />
                              {i < arr.length - 1 && (
                                <div style={{ width: "1px", flex: 1, background: "var(--c-border)", marginTop: "5px" }} />
                              )}
                            </div>
                            <div style={{ paddingBottom: "4px" }}>
                              <div style={{ fontSize: "13px", fontWeight: 650, color: "var(--c-text-1)" }}>
                                {STATUS_LABELS[h.to_status] || h.to_status}
                              </div>
                              {h.from_status && (
                                <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "1px" }}>
                                  from {STATUS_LABELS[h.from_status] || h.from_status}
                                </div>
                              )}
                              {h.comment && (
                                <div style={{ fontSize: "12px", color: "var(--c-text-3)", marginTop: "4px", fontStyle: "italic" }}>
                                  "{h.comment}"
                                </div>
                              )}
                              <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "3px" }}>
                                {formatDate(h.created_at)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
