"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check, GraduationCap } from "lucide-react";
import { facultiesApi, universitiesApi, type Faculty, type University } from "@/lib/api";

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
  description: string;
  university_id: string;
}

const emptyForm: FormData = { name: "", description: "", university_id: "" };

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUni, setFilterUni] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uniPickerOpen, setUniPickerOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [facData, uniData] = await Promise.all([
        facultiesApi.list(filterUni || undefined, search || undefined),
        universitiesApi.list(),
      ]);
      setFaculties(facData);
      setUniversities(uniData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  }, [filterUni, search]);

  useEffect(() => { load(); }, [load]);

  const selectedFilterUni = universities.find((u) => u.id === filterUni);
  const selectedFormUni = universities.find((u) => u.id === form.university_id);

  function openCreate() { setEditingId(null); setForm(emptyForm); setDrawerOpen(true); }
  function openEdit(f: Faculty) {
    setEditingId(f.id);
    setForm({ name: f.name, description: f.description || "", university_id: f.university_id });
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.university_id) return;
    setSaving(true);
    try {
      const payload = { name: form.name, university_id: form.university_id, ...(form.description ? { description: form.description } : {}) };
      if (editingId) await facultiesApi.update(editingId, payload);
      else await facultiesApi.create(payload);
      setDrawerOpen(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this faculty?")) return;
    try { await facultiesApi.delete(id); await load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  function getUniName(id: string) { return universities.find((u) => u.id === id)?.name || "—"; }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>Faculties</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>Faculties per university</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculties..."
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
              <GraduationCap width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
              <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedFilterUni ? selectedFilterUni.name : "All universities"}
              </span>
              <ChevronDown width={13} height={13} stroke="var(--c-text-4)" strokeWidth={2} />
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                <div className="absolute z-50" style={{ top: "40px", right: 0, width: "280px", maxHeight: "300px", overflowY: "auto", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px" }}>
                  <div onClick={() => { setFilterUni(""); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                    style={{ padding: "8px 10px", borderRadius: "8px", background: !filterUni ? "var(--c-nav-active-bg)" : "transparent" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>All universities</span>
                    {!filterUni && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                  </div>
                  {universities.map((u) => (
                    <div key={u.id} onClick={() => { setFilterUni(u.id); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                      style={{ padding: "8px 10px", borderRadius: "8px", background: filterUni === u.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>{u.name}</span>
                      {filterUni === u.id && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={openCreate} className="flex items-center cursor-pointer"
            style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}>
            <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />Add faculty
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
      ) : faculties.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>No faculties found. Add your first faculty to get started.</div>
      ) : (
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden", background: "var(--c-bg-elevated)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                {["Faculty", "Description", "University", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faculties.map((f) => (
                <tr key={f.id} className="group hoverable" style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{f.name}</span>
                  </td>
                  <td style={{ padding: "12px 16px", maxWidth: "300px" }}>
                    <span style={{ fontSize: "13px", color: "var(--c-text-3)" }}>{f.description || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--c-chip-info-text)", background: "var(--c-chip-info-bg)", padding: "3px 10px", borderRadius: "20px" }}>
                      {f.university?.name || getUniName(f.university_id)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                      <button onClick={() => openEdit(f)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "7px" }}>
                        <Pencil width={13} height={13} stroke="var(--c-text-3)" strokeWidth={2} />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "7px" }}>
                        <Trash2 width={13} height={13} stroke="#dc2626" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "400px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingId ? "Edit Faculty" : "Add Faculty"}</h2>
              <button onClick={() => setDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Faculty Name *</label>
                <input style={inputStyle} placeholder="e.g. Faculty of Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>University *</label>
                <div className="relative">
                  <button onClick={() => setUniPickerOpen(!uniPickerOpen)} className="flex items-center justify-between cursor-pointer" style={{ ...inputStyle, display: "flex" }}>
                    <span style={{ color: selectedFormUni ? "var(--c-text-1)" : "var(--c-text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedFormUni ? selectedFormUni.name : "Select university"}
                    </span>
                    <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  </button>
                  {uniPickerOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUniPickerOpen(false)} />
                      <div className="absolute z-50" style={{ top: "42px", left: 0, right: 0, maxHeight: "220px", overflowY: "auto", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "10px", boxShadow: "var(--c-shadow-heavy)", padding: "4px" }}>
                        {universities.map((u) => (
                          <div key={u.id} onClick={() => { setForm({ ...form, university_id: u.id }); setUniPickerOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                            style={{ padding: "8px 10px", borderRadius: "7px", background: form.university_id === u.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-text-1)" }}>{u.name}</span>
                            {form.university_id === u.id && <Check width={14} height={14} stroke="#2563eb" strokeWidth={2.4} />}
                          </div>
                        ))}
                        {universities.length === 0 && <div style={{ padding: "12px 10px", fontSize: "13px", color: "var(--c-text-4)", textAlign: "center" }}>No universities. Create one first.</div>}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Description</label>
                <textarea style={textareaStyle} placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.university_id} className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: saving || !form.name || !form.university_id ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
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
