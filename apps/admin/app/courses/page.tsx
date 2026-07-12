"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check } from "lucide-react";
import { coursesApi, facultiesApi, degreesApi, type Course, type Faculty, type Degree, type CreateCourseData } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "38px",
  padding: "0 12px",
  fontSize: "13px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "9px",
  background: "var(--c-bg-elevated)",
  color: "var(--c-text-1)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--c-text-3)",
  marginBottom: "5px",
  display: "block",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "80px",
  padding: "10px 12px",
  resize: "vertical" as const,
};

interface FormData {
  name: string;
  course_code: string;
  tuition_fee: string;
  currency: string;
  duration_months: string;
  faculty_id: string;
  degree_id: string;
  intake: string;
  ielts_requirement: string;
  pte_requirement: string;
  toefl_requirement: string;
  overview: string;
  scholarship_available: boolean;
}

const emptyForm: FormData = {
  name: "", course_code: "", tuition_fee: "", currency: "AUD", duration_months: "",
  faculty_id: "", degree_id: "", intake: "", ielts_requirement: "", pte_requirement: "",
  toefl_requirement: "", overview: "", scholarship_available: false,
};

function Picker({ label, value, options, onSelect, placeholder, renderOption }: {
  label: string;
  value: string;
  options: { id: string; label: string; sub?: string }[];
  onSelect: (id: string) => void;
  placeholder: string;
  renderOption?: (o: { id: string; label: string; sub?: string }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between cursor-pointer" style={{ ...inputStyle, display: "flex" }}>
          <span style={{ color: selected ? "var(--c-text-1)" : "var(--c-text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} style={{ flexShrink: 0 }} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute z-50" style={{ top: "42px", left: 0, right: 0, maxHeight: "220px", overflowY: "auto", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "10px", boxShadow: "var(--c-shadow-heavy)", padding: "4px" }}>
              {options.map((o) => (
                <div key={o.id} onClick={() => { onSelect(o.id); setOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                  style={{ padding: "8px 10px", borderRadius: "7px", background: value === o.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                  {renderOption ? renderOption(o) : (
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-text-1)" }}>{o.label}</div>
                      {o.sub && <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{o.sub}</div>}
                    </div>
                  )}
                  {value === o.id && <Check width={14} height={14} stroke="#2563eb" strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                </div>
              ))}
              {options.length === 0 && <div style={{ padding: "12px 10px", fontSize: "13px", color: "var(--c-text-4)", textAlign: "center" }}>None available</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [courseData, facultyData, degreeData] = await Promise.all([
        coursesApi.list(filterFaculty || undefined, search || undefined),
        facultiesApi.list(),
        degreesApi.list(),
      ]);
      setCourses(courseData);
      setFaculties(facultyData);
      setDegrees(degreeData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  }, [filterFaculty, search]);

  useEffect(() => { load(); }, [load]);

  const selectedFilterFaculty = faculties.find((f) => f.id === filterFaculty);

  function openCreate() { setEditingId(null); setForm(emptyForm); setDrawerOpen(true); }
  function openEdit(c: Course) {
    setEditingId(c.id);
    setForm({
      name: c.name, course_code: c.course_code, tuition_fee: String(c.tuition_fee),
      currency: c.currency, duration_months: String(c.duration_months),
      faculty_id: c.faculty_id, degree_id: c.degree_id, intake: c.intake || "",
      ielts_requirement: c.ielts_requirement != null ? String(c.ielts_requirement) : "",
      pte_requirement: c.pte_requirement != null ? String(c.pte_requirement) : "",
      toefl_requirement: c.toefl_requirement != null ? String(c.toefl_requirement) : "",
      overview: c.overview || "", scholarship_available: c.scholarship_available,
    });
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.course_code || !form.tuition_fee || !form.faculty_id || !form.degree_id || !form.duration_months) return;
    setSaving(true);
    try {
      const data: CreateCourseData = {
        name: form.name,
        course_code: form.course_code,
        tuition_fee: parseFloat(form.tuition_fee),
        currency: form.currency,
        duration_months: parseInt(form.duration_months, 10),
        faculty_id: form.faculty_id,
        degree_id: form.degree_id,
        scholarship_available: form.scholarship_available,
        ...(form.intake && { intake: form.intake }),
        ...(form.ielts_requirement && { ielts_requirement: parseFloat(form.ielts_requirement) }),
        ...(form.pte_requirement && { pte_requirement: parseFloat(form.pte_requirement) }),
        ...(form.toefl_requirement && { toefl_requirement: parseFloat(form.toefl_requirement) }),
        ...(form.overview && { overview: form.overview }),
      };
      if (editingId) await coursesApi.update(editingId, data);
      else await coursesApi.create(data);
      setDrawerOpen(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    try { await coursesApi.delete(id); await load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  function getFacultyName(id: string) { return faculties.find((f) => f.id === id)?.name || "—"; }
  function getDegreeName(id: string) { return degrees.find((d) => d.id === id)?.name || "—"; }

  const canSave = form.name && form.course_code && form.tuition_fee && form.faculty_id && form.degree_id && form.duration_months;

  const facultyOptions = faculties.map((f) => ({ id: f.id, label: f.name, sub: f.university?.name }));
  const degreeOptions = degrees.map((d) => ({ id: d.id, label: d.name }));

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>Courses</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>Course catalog — faculty + degree level</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{
              height: "34px",
              padding: "0 12px",
              fontSize: "12.5px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "9px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-1)",
              outline: "none",
              width: "180px",
            }}
          />
          <div className="relative">
            <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center cursor-pointer hoverable"
              style={{ height: "34px", gap: "7px", padding: "0 12px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "12.5px", fontWeight: 550, color: "var(--c-text-1)" }}>
              <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedFilterFaculty ? selectedFilterFaculty.name : "All faculties"}
              </span>
              <ChevronDown width={13} height={13} stroke="var(--c-text-4)" strokeWidth={2} />
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                <div className="absolute z-50" style={{ top: "40px", right: 0, width: "280px", maxHeight: "300px", overflowY: "auto", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px" }}>
                  <div onClick={() => { setFilterFaculty(""); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                    style={{ padding: "8px 10px", borderRadius: "8px", background: !filterFaculty ? "var(--c-nav-active-bg)" : "transparent" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>All faculties</span>
                    {!filterFaculty && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                  </div>
                  {faculties.map((f) => (
                    <div key={f.id} onClick={() => { setFilterFaculty(f.id); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                      style={{ padding: "8px 10px", borderRadius: "8px", background: filterFaculty === f.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>{f.name}</div>
                        {f.university && <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{f.university.name}</div>}
                      </div>
                      {filterFaculty === f.id && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={openCreate} className="flex items-center cursor-pointer"
            style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}>
            <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />Add course
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between" style={{ padding: "10px 14px", marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626" }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><X width={14} height={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}><Loader2 width={24} height={24} className="animate-spin" /></div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>No courses found. Add your first course to get started.</div>
      ) : (
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden", background: "var(--c-bg-elevated)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                  {["Course", "Code", "Faculty", "Degree", "Fee", "Duration", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="group hoverable" style={{ borderBottom: "1px solid var(--c-border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{c.name}</div>
                      {c.scholarship_available && (
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-chip-success-text)", marginTop: "2px" }}>Scholarship available</div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--c-text-3)", background: "var(--c-bg-surface)", padding: "2px 8px", borderRadius: "6px" }}>{c.course_code}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--c-chip-info-text)", background: "var(--c-chip-info-bg)", padding: "3px 10px", borderRadius: "20px" }}>
                        {c.faculty?.name || getFacultyName(c.faculty_id)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--c-chip-ai-text)", background: "var(--c-chip-ai-bg)", padding: "3px 10px", borderRadius: "20px" }}>
                        {c.degree?.name || getDegreeName(c.degree_id)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.currency} {Number(c.tuition_fee).toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "13px", color: "var(--c-text-2)" }}>{c.duration_months}mo</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                        <button onClick={() => openEdit(c)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "7px" }}>
                          <Pencil width={13} height={13} stroke="var(--c-text-3)" strokeWidth={2} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "7px" }}>
                          <Trash2 width={13} height={13} stroke="#dc2626" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "460px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingId ? "Edit Course" : "Add Course"}</h2>
              <button onClick={() => setDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Course Name *</label>
                <input style={inputStyle} placeholder="e.g. Software Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Course Code *</label>
                  <input style={inputStyle} placeholder="e.g. CS101" value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Duration (months) *</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 24" value={form.duration_months} onChange={(e) => setForm({ ...form, duration_months: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Tuition Fee *</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 35000" value={form.tuition_fee} onChange={(e) => setForm({ ...form, tuition_fee: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Currency</label>
                  <input style={inputStyle} placeholder="AUD" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
                </div>
              </div>

              <Picker label="Faculty *" value={form.faculty_id} options={facultyOptions} onSelect={(id) => setForm({ ...form, faculty_id: id })} placeholder="Select faculty" />
              <Picker label="Degree *" value={form.degree_id} options={degreeOptions} onSelect={(id) => setForm({ ...form, degree_id: id })} placeholder="Select degree" />

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Intake</label>
                <input style={inputStyle} placeholder="e.g. February, July" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })} />
              </div>

              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>English Requirements</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ielts_requirement", "pte_requirement", "toefl_requirement"] as const).map((field, i) => (
                    <div key={field}>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "4px" }}>{["IELTS", "PTE", "TOEFL"][i]}</div>
                      <input style={inputStyle} type="number" step="0.5" placeholder={["6.5", "58", "79"][i]}
                        value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                <label style={labelStyle}>Overview</label>
                <textarea style={textareaStyle} placeholder="Brief course description..." value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.scholarship_available} onChange={(e) => setForm({ ...form, scholarship_available: e.target.checked })} />
                <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Scholarship available</span>
              </label>
            </div>

            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !canSave} className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: saving || !canSave ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {saving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
