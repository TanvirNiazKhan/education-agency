"use client";

import { useState } from "react";
import { Plus, ChevronDown, Check, X } from "lucide-react";

const columns = ["Degree", "Program", "Faculty", "Duration", "Annual Tuition", "App Fee", "IELTS", "PTE", "GRE", "Scholarship", "Deadline", "Status"];

const defaultCourseRows = [
  ["Master", "MSc Data Science", "Engineering & IT", "2 yrs", "A$48,000", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["Master", "Master of Engineering", "Engineering & IT", "2 yrs", "A$46,400", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["Bachelor", "Bachelor of Commerce", "Business & Economics", "3 yrs", "A$44,000", "A$100", "6.5", "58", "—", "No", "30 Sep 2026", "Open"],
  ["Master", "Master of IT", "Engineering & IT", "2 yrs", "A$47,200", "A$100", "6.5", "58", "—", "Yes", "31 Aug 2026", "Open"],
  ["PhD", "PhD Computer Science", "Engineering & IT", "3-4 yrs", "A$42,800", "Waived", "7.0", "65", "—", "Yes", "31 Oct 2026", "Open"],
  ["Master", "MSc Finance", "Business & Economics", "1.5 yrs", "A$49,200", "A$100", "7.0", "65", "—", "Yes", "15 Sep 2026", "Closing"],
  ["Bachelor", "BSc Computer Science", "Engineering & IT", "3 yrs", "A$46,000", "A$100", "6.5", "58", "—", "No", "30 Sep 2026", "Open"],
  ["Master", "MA International Relations", "Arts & Humanities", "2 yrs", "A$38,400", "A$100", "7.0", "65", "—", "No", "31 Aug 2026", "Open"],
  ["Diploma", "Graduate Diploma Education", "Arts & Humanities", "1 yr", "A$34,800", "A$75", "7.5", "73", "—", "No", "30 Jun 2026", "Closed"],
  ["Master", "Master of Architecture", "Design", "3 yrs", "A$44,800", "A$100", "6.5", "58", "—", "Yes", "15 Sep 2026", "Draft"],
];

const uniOptions = [
  { name: "University of Melbourne", init: "UM", city: "Melbourne", country: "Australia", color: "#2563eb", courses: 12 },
  { name: "University of Toronto", init: "UT", city: "Toronto", country: "Canada", color: "#7c3aed", courses: 9 },
  { name: "University College London", init: "UCL", city: "London", country: "United Kingdom", color: "#0891b2", courses: 14 },
  { name: "University of Sydney", init: "US", city: "Sydney", country: "Australia", color: "#ea580c", courses: 11 },
  { name: "TU Munich", init: "TUM", city: "Munich", country: "Germany", color: "#16a34a", courses: 8 },
];

const fieldOptions = ["All fields", "Engineering & IT", "Business & Economics", "Science", "Law", "Design", "Health & Medicine", "Arts & Humanities"];
const degreeOptions = ["Bachelor", "Master", "PhD", "Diploma"];
const statusOptions = ["Open", "Closing", "Draft", "Closed"];
const facultyOptions = fieldOptions.filter((f) => f !== "All fields");

const filterBtnStyle: React.CSSProperties = {
  height: "30px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "0 10px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "8px",
  background: "var(--c-bg-elevated)",
  color: "var(--c-text-2)",
  fontSize: "12.5px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const gridToolStyle: React.CSSProperties = {
  ...filterBtnStyle,
  height: "28px",
  fontSize: "12px",
  gap: "4px",
};

function StatusChip({ status }: { status: string }) {
  const style =
    status === "Open"
      ? { fontSize: "11px", fontWeight: 600, color: "#059669", background: "#ecfdf3", padding: "2px 8px", borderRadius: "20px" }
      : status === "Closing"
      ? { fontSize: "11px", fontWeight: 600, color: "#b45309", background: "#fffaeb", padding: "2px 8px", borderRadius: "20px" }
      : status === "Draft"
      ? { fontSize: "11px", fontWeight: 600, color: "#a1a1aa", background: "#f4f4f5", padding: "2px 8px", borderRadius: "20px" }
      : { fontSize: "11px", fontWeight: 600, color: "#dc2626", background: "#fef3f2", padding: "2px 8px", borderRadius: "20px" };
  return <span style={style}>{status}</span>;
}

/* ── Form field styles ────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--c-text-2)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "36px",
  padding: "0 11px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "9px",
  background: "var(--c-bg-input)",
  color: "var(--c-text-1)",
  fontSize: "13px",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "30px",
};

interface CourseForm {
  degree: string;
  program: string;
  faculty: string;
  duration: string;
  tuition: string;
  appFee: string;
  ielts: string;
  pte: string;
  gre: string;
  scholarship: string;
  deadline: string;
  status: string;
}

const emptyForm: CourseForm = {
  degree: "Master",
  program: "",
  faculty: "Engineering & IT",
  duration: "",
  tuition: "",
  appFee: "",
  ielts: "",
  pte: "",
  gre: "",
  scholarship: "No",
  deadline: "",
  status: "Draft",
};

/* ── Add Course Drawer ────────────────────────────────── */

function AddCourseDrawer({
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "var(--c-overlay)", animation: "overlayIn 0.15s ease" }}
        onClick={onClose}
      />

      {/* Drawer */}
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
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--c-border)",
          }}
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
                <select
                  value={form.degree}
                  onChange={(e) => set("degree", e.target.value)}
                  style={selectStyle}
                >
                  {degreeOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  style={selectStyle}
                >
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
                style={{
                  ...inputStyle,
                  borderColor: errors.program ? "#dc2626" : undefined,
                }}
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
              <select
                value={form.faculty}
                onChange={(e) => set("faculty", e.target.value)}
                style={selectStyle}
              >
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
                  style={{
                    ...inputStyle,
                    borderColor: errors.duration ? "#dc2626" : undefined,
                  }}
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

            {/* Separator */}
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
                    style={{
                      ...inputStyle,
                      borderColor: errors.tuition ? "#dc2626" : undefined,
                    }}
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

            {/* Separator */}
            <div style={{ height: "1px", background: "var(--c-border)", margin: "2px 0" }} />

            {/* Test scores section */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
                Test Score Requirements
              </div>
              <div className="grid grid-cols-3" style={{ gap: "12px" }}>
                <div>
                  <label style={labelStyle}>IELTS</label>
                  <input
                    value={form.ielts}
                    onChange={(e) => set("ielts", e.target.value)}
                    placeholder="e.g. 6.5"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>PTE</label>
                  <input
                    value={form.pte}
                    onChange={(e) => set("pte", e.target.value)}
                    placeholder="e.g. 58"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>GRE</label>
                  <input
                    value={form.gre}
                    onChange={(e) => set("gre", e.target.value)}
                    placeholder="e.g. 310"
                    style={inputStyle}
                  />
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
          style={{
            gap: "10px",
            padding: "14px 20px",
            borderTop: "1px solid var(--c-border)",
          }}
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

/* ── Main Page ────────────────────────────────────────── */

export default function CoursesPage() {
  const [selectedUni, setSelectedUni] = useState(0);
  const [selectedField, setSelectedField] = useState("All fields");
  const [uniMenuOpen, setUniMenuOpen] = useState(false);
  const [fieldMenuOpen, setFieldMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [courseRows, setCourseRows] = useState(defaultCourseRows);

  const uni = uniOptions[selectedUni];
  const filtered = selectedField === "All fields" ? courseRows : courseRows.filter((r) => r[2] === selectedField);

  function handleAddCourse(row: string[]) {
    setCourseRows((prev) => [...prev, row]);
  }

  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.28s ease" }}>
      <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 md:px-8" style={{ flexShrink: 0 }}>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "14px" }}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
              Course Editor
            </h1>

            {/* University selector */}
            <div className="relative">
              <button
                onClick={() => setUniMenuOpen(!uniMenuOpen)}
                className="flex items-center cursor-pointer hoverable"
                style={{ gap: "9px", height: "36px", padding: "0 11px", border: "1px solid var(--c-border-input)", borderRadius: "10px", background: "var(--c-bg-elevated)" }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ width: "26px", height: "26px", borderRadius: "7px", background: uni.color + "18", color: uni.color, fontSize: "9.5px", fontWeight: 700 }}
                >
                  {uni.init}
                </div>
                <div style={{ textAlign: "left", lineHeight: 1.15 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>{uni.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{uni.courses} courses</div>
                </div>
                <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} style={{ marginLeft: "2px" }} />
              </button>
              {uniMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUniMenuOpen(false)} />
                  <div className="absolute z-41" style={{ top: "42px", left: 0, width: "284px", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px", zIndex: 41 }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--c-text-5)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 10px 6px" }}>
                      Select university
                    </div>
                    {uniOptions.map((u, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedUni(i); setUniMenuOpen(false); }}
                        className="flex items-center cursor-pointer hoverable"
                        style={{ gap: "10px", padding: "8px 10px", borderRadius: "8px", background: i === selectedUni ? "var(--c-nav-active-bg)" : "transparent" }}
                      >
                        <div
                          className="flex items-center justify-center"
                          style={{ width: "26px", height: "26px", borderRadius: "7px", background: u.color + "18", color: u.color, fontSize: "9.5px", fontWeight: 700, flexShrink: 0 }}
                        >
                          {u.init}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: "12.5px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{u.city}, {u.country}</div>
                        </div>
                        {i === selectedUni && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="hidden sm:inline" style={{ color: "var(--c-text-slash)", fontSize: "14px" }}>/</span>

            {/* Field of study selector */}
            <div className="relative">
              <button
                onClick={() => setFieldMenuOpen(!fieldMenuOpen)}
                className="flex items-center cursor-pointer hoverable"
                style={{ gap: "8px", height: "36px", padding: "0 12px", border: "1px solid var(--c-border-input)", borderRadius: "10px", background: "var(--c-bg-elevated)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)" }}>{selectedField}</span>
                <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
              </button>
              {fieldMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFieldMenuOpen(false)} />
                  <div className="absolute z-41" style={{ top: "42px", left: 0, width: "236px", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px", zIndex: 41 }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--c-text-5)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 10px 6px" }}>
                      Field of study
                    </div>
                    {fieldOptions.map((f) => (
                      <div
                        key={f}
                        onClick={() => { setSelectedField(f); setFieldMenuOpen(false); }}
                        className="flex items-center justify-between cursor-pointer hoverable"
                        style={{ padding: "8px 10px", borderRadius: "8px", background: f === selectedField ? "var(--c-nav-active-bg)" : "transparent" }}
                      >
                        <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>{f}</span>
                        {f === selectedField && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap" style={{ gap: "8px" }}>
            <button style={filterBtnStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></svg>
              Import CSV / Excel
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center cursor-pointer"
              style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}
            >
              <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />
              Add course
            </button>
          </div>
        </div>

        {/* Grid toolbar */}
        <div className="flex flex-wrap items-center" style={{ gap: "7px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-chip-info-text)", background: "var(--c-chip-info-bg)", padding: "4px 10px", borderRadius: "7px" }}>
            {filtered.length} rows
          </span>
          <div style={{ width: "1px", height: "18px", background: "var(--c-border-divider)" }} />
          {["Bulk edit", "Copy", "Paste", "Duplicate"].map((tool) => (
            <button key={tool} style={gridToolStyle}>{tool}</button>
          ))}
          <div className="flex-1" />
          <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>Autosaved &middot; just now</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto px-4 pb-6 sm:px-6 md:px-8 md:pb-10">
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden", minWidth: "min-content" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "44px minmax(80px,1fr) minmax(180px,2.5fr) minmax(120px,1.5fr) minmax(70px,0.8fr) minmax(90px,1fr) minmax(70px,0.8fr) minmax(55px,0.6fr) minmax(50px,0.5fr) minmax(50px,0.5fr) minmax(90px,1fr) minmax(90px,1fr) minmax(80px,0.8fr)",
              background: "var(--c-bg-panel)",
              borderBottom: "1px solid var(--c-border)",
              position: "sticky",
              top: 0,
              zIndex: 3,
            }}
          >
            <div className="flex items-center justify-center" style={{ height: "38px", borderRight: "1px solid var(--c-border-grid)" }}>
              <div style={{ width: "14px", height: "14px", border: "1.6px solid var(--c-border-check)", borderRadius: "4px" }} />
            </div>
            {columns.map((col) => (
              <div
                key={col}
                className="flex items-center"
                style={{
                  padding: "0 10px",
                  height: "38px",
                  borderRight: "1px solid var(--c-border-grid)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  color: "var(--c-text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((row, ri) => (
            <div
              key={ri}
              className="hoverable"
              style={{
                display: "grid",
                gridTemplateColumns: "44px minmax(80px,1fr) minmax(180px,2.5fr) minmax(120px,1.5fr) minmax(70px,0.8fr) minmax(90px,1fr) minmax(70px,0.8fr) minmax(55px,0.6fr) minmax(50px,0.5fr) minmax(50px,0.5fr) minmax(90px,1fr) minmax(90px,1fr) minmax(80px,0.8fr)",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  height: "40px",
                  borderRight: "1px solid var(--c-border-grid)",
                  borderBottom: "1px solid var(--c-border-grid)",
                  background: "var(--c-bg-panel)",
                  fontSize: "11px",
                  color: "var(--c-text-row-num)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {ri + 1}
              </div>
              {row.map((val, ci) => (
                <div
                  key={ci}
                  className="flex items-center"
                  style={{
                    padding: "0 10px",
                    height: "40px",
                    fontSize: "12.5px",
                    color: ci === 1 ? "var(--c-text-1)" : "var(--c-text-2)",
                    fontWeight: ci === 1 ? 500 : 400,
                    borderRight: "1px solid var(--c-border-grid)",
                    borderBottom: "1px solid var(--c-border-grid)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    background: "var(--c-bg-elevated)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ci === 11 ? <StatusChip status={val} /> : val}
                </div>
              ))}
            </div>
          ))}

          {/* Add row */}
          <div
            onClick={() => setDrawerOpen(true)}
            className="flex items-center cursor-pointer hoverable"
            style={{ gap: "8px", height: "38px", padding: "0 14px", background: "var(--c-bg-elevated)", color: "var(--c-text-4)", fontSize: "12.5px" }}
          >
            <Plus width={14} height={14} strokeWidth={2} />
            Add row
          </div>
        </div>
      </div>

      {/* Add Course Drawer */}
      <AddCourseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddCourse}
      />
    </div>
  );
}
