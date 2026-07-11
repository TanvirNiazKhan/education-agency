"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { degreesApi, type Degree } from "@/lib/api";

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

const degreeColors = [
  { bg: "#eef4ff", text: "#2563eb" },
  { bg: "#f3e8ff", text: "#7c3aed" },
  { bg: "#ecfdf3", text: "#15803d" },
  { bg: "#fef3f2", text: "#dc2626" },
  { bg: "#fffaeb", text: "#d97706" },
  { bg: "#f0fdf4", text: "#16a34a" },
  { bg: "#f0f9ff", text: "#0369a1" },
  { bg: "#fdf4ff", text: "#a21caf" },
];

export default function DegreesPage() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setDegrees(await degreesApi.list());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditingId(null); setName(""); setDrawerOpen(true); }
  function openEdit(d: Degree) { setEditingId(d.id); setName(d.name); setDrawerOpen(true); }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) await degreesApi.update(editingId, { name: name.trim() });
      else await degreesApi.create({ name: name.trim() });
      setDrawerOpen(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this degree type?")) return;
    try { await degreesApi.delete(id); await load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>Degree Types</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>Education levels — Bachelor, Master, PhD, Pre-school…</p>
        </div>
        <button onClick={openCreate} className="flex items-center cursor-pointer"
          style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}>
          <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />Add degree type
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between" style={{ padding: "10px 14px", marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626" }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><X width={14} height={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}>
          <Loader2 width={24} height={24} className="animate-spin" />
        </div>
      ) : degrees.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>
          No degree types yet. Add Bachelor, Master, PhD, Pre-school etc.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {degrees.map((d, i) => {
            const color = degreeColors[i % degreeColors.length];
            return (
              <div key={d.id} className="group flex items-center gap-3"
                style={{ padding: "10px 16px", border: "1px solid var(--c-border)", borderRadius: "12px", background: "var(--c-bg-elevated)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: color.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: color.text, flexShrink: 0 }}>
                  {d.name.charAt(0)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{d.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                  <button onClick={() => openEdit(d)} className="cursor-pointer"
                    style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                    <Pencil width={11} height={11} stroke="var(--c-text-3)" strokeWidth={2} />
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="cursor-pointer"
                    style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px" }}>
                    <Trash2 width={11} height={11} stroke="#dc2626" strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "360px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingId ? "Edit Degree Type" : "Add Degree Type"}</h2>
              <button onClick={() => setDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>

            <div className="flex-1" style={{ padding: "20px" }}>
              <label style={labelStyle}>Name *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Bachelor, Master, PhD, Pre-school"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
              <p style={{ margin: "10px 0 0", fontSize: "12px", color: "var(--c-text-4)" }}>
                Used as a label when creating courses.
              </p>
            </div>

            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !name.trim()} className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: saving || !name.trim() ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
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
