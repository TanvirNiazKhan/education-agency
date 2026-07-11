"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  type CourseForm,
  emptyForm,
  degreeOptions,
  statusOptions,
  facultyOptions,
  labelStyle,
  inputStyle,
  selectStyle,
} from "../_data/constants";

export function AddCourseDrawer({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (row: string[]) => void;
}) {
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CourseForm, boolean>>>({});

  function set<K extends keyof CourseForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  }

  function handleSubmit() {
    const required: (keyof CourseForm)[] = ["program", "duration", "tuition"];
    const next: typeof errors = {};
    for (const k of required) if (!form[k].trim()) next[k] = true;
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onAdd([
      form.degree,
      form.program,
      form.faculty,
      form.duration,
      form.tuition,
      form.appFee || "—",
      form.ielts || "—",
      form.pte || "—",
      form.gre || "—",
      form.scholarship,
      form.deadline || "—",
      form.status,
    ]);
    setForm(emptyForm);
    setErrors({});
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "var(--c-overlay)", animation: "overlayIn 0.15s ease" }}
        onClick={onClose}
      />

      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-[420px]"
        style={{
          background: "var(--c-bg-elevated)",
          borderLeft: "1px solid var(--c-border)",
          boxShadow: "-8px 0 30px var(--c-shadow-heavy)",
          animation: "drawerIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: "18px 20px", borderBottom: "1px solid var(--c-border)" }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>
              Add Course
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--c-text-3)" }}>
              Fill in course details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "8px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-4)",
            }}
          >
            <X width={16} height={16} strokeWidth={2} />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "20px" }}>
          <div className="flex flex-col" style={{ gap: "16px" }}>
            {/* Row: Degree + Status */}
            <div className="grid grid-cols-2" style={{ gap: "12px" }}>
              <div>
                <label style={labelStyle}>Degree</label>
                <select value={form.degree} onChange={(e) => set("degree", e.target.value)} style={selectStyle}>
                  {degreeOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} style={selectStyle}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Program */}
            <div>
              <label style={labelStyle}>
                Program name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                placeholder="e.g. MSc Data Science"
                style={{ ...inputStyle, borderColor: errors.program ? "#dc2626" : undefined }}
              />
              {errors.program && (
                <span style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", display: "block" }}>
                  Program name is required
                </span>
              )}
            </div>

            {/* Faculty */}
            <div>
              <label style={labelStyle}>Faculty</label>
              <select value={form.faculty} onChange={(e) => set("faculty", e.target.value)} style={selectStyle}>
                {facultyOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Row: Duration + Deadline */}
            <div className="grid grid-cols-2" style={{ gap: "12px" }}>
              <div>
                <label style={labelStyle}>
                  Duration <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="e.g. 2 yrs"
                  style={{ ...inputStyle, borderColor: errors.duration ? "#dc2626" : undefined }}
                />
              </div>
              <div>
                <label style={labelStyle}>Deadline</label>
                <input
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  placeholder="e.g. 31 Aug 2026"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ height: "1px", background: "var(--c-border)", margin: "2px 0" }} />

            {/* Fees section */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
                Fees
              </div>
              <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                <div>
                  <label style={labelStyle}>
                    Annual Tuition <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    value={form.tuition}
                    onChange={(e) => set("tuition", e.target.value)}
                    placeholder="e.g. A$48,000"
                    style={{ ...inputStyle, borderColor: errors.tuition ? "#dc2626" : undefined }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Application Fee</label>
                  <input
                    value={form.appFee}
                    onChange={(e) => set("appFee", e.target.value)}
                    placeholder="e.g. A$100"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div style={{ height: "1px", background: "var(--c-border)", margin: "2px 0" }} />

            {/* Test scores section */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
                Test Score Requirements
              </div>
              <div className="grid grid-cols-3" style={{ gap: "12px" }}>
                <div>
                  <label style={labelStyle}>IELTS</label>
                  <input value={form.ielts} onChange={(e) => set("ielts", e.target.value)} placeholder="e.g. 6.5" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>PTE</label>
                  <input value={form.pte} onChange={(e) => set("pte", e.target.value)} placeholder="e.g. 58" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>GRE</label>
                  <input value={form.gre} onChange={(e) => set("gre", e.target.value)} placeholder="e.g. 310" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Scholarship toggle */}
            <div>
              <label style={labelStyle}>Scholarship available</label>
              <div className="flex" style={{ gap: "6px" }}>
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set("scholarship", opt)}
                    className="cursor-pointer"
                    style={{
                      height: "34px",
                      padding: "0 18px",
                      border: "1px solid",
                      borderColor: form.scholarship === opt ? "#2563eb" : "var(--c-border-input)",
                      borderRadius: "8px",
                      background: form.scholarship === opt ? "var(--c-chip-info-bg)" : "var(--c-bg-elevated)",
                      color: form.scholarship === opt ? "#2563eb" : "var(--c-text-2)",
                      fontSize: "13px",
                      fontWeight: form.scholarship === opt ? 600 : 500,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end shrink-0"
          style={{ gap: "10px", padding: "14px 20px", borderTop: "1px solid var(--c-border)" }}
        >
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              height: "36px",
              padding: "0 16px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "9px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-2)",
              fontSize: "13px",
              fontWeight: 550,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer"
            style={{
              height: "36px",
              padding: "0 20px",
              border: "none",
              borderRadius: "9px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 550,
              boxShadow: "0 1px 2px rgba(37,99,235,0.25)",
            }}
          >
            Add Course
          </button>
        </div>
      </div>
    </>
  );
}
