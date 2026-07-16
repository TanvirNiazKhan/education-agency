"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Plus, X, Loader2, Shield, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { adminUsersApi, type AdminUser, type CreateAdminData } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const inputStyle: React.CSSProperties = {
  width: "100%", height: "38px", padding: "0 12px", fontSize: "13px",
  border: "1px solid var(--c-border-input)", borderRadius: "9px",
  background: "var(--c-bg-elevated)", color: "var(--c-text-1)", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)",
  marginBottom: "5px", display: "block",
};

const emptyForm: CreateAdminData = {
  first_name: "", last_name: "", email: "", phone: "", password: "",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<CreateAdminData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setAdmins(await adminUsersApi.list());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) loadAdmins();
    else setLoading(false);
  }, [isSuperAdmin, loadAdmins]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password) return;
    setSaving(true);
    setError(null);
    try {
      await adminUsersApi.create({ ...form, email: form.email.toLowerCase() });
      setDrawerOpen(false);
      setForm(emptyForm);
      await loadAdmins();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create admin");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(admin: AdminUser) {
    try {
      if (admin.is_active) {
        await adminUsersApi.deactivate(admin.id);
      } else {
        await adminUsersApi.activate(admin.id);
      }
      await loadAdmins();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>
          Only Super Admin can manage admin users.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
            Admin Users
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>
            Manage admin accounts and access
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setDrawerOpen(true); }}
          className="flex items-center cursor-pointer"
          style={{
            height: "34px", gap: "6px", padding: "0 13px",
            background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px",
            fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)",
          }}
        >
          <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />
          Add Admin
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between" style={{
          padding: "10px 14px", marginBottom: "16px", background: "#fef2f2",
          border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626",
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>
            <X width={14} height={14} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}>
          <Loader2 width={24} height={24} className="animate-spin" />
        </div>
      ) : admins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>
          No admin users yet. Add your first admin.
        </div>
      ) : (
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "14px", overflow: "hidden" }}>
          {admins.map((admin, i) => (
            <div
              key={admin.id}
              className="flex items-center justify-between group"
              style={{
                padding: "14px 18px",
                borderBottom: i < admins.length - 1 ? "1px solid var(--c-border)" : "none",
                background: "var(--c-bg-elevated)",
                opacity: admin.is_active ? 1 : 0.6,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center text-white"
                  style={{
                    width: "36px", height: "36px", borderRadius: "9px",
                    background: admin.role === "super_admin"
                      ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                      : "linear-gradient(135deg, #2563eb, #60a5fa)",
                    fontSize: "13px", fontWeight: 600, flexShrink: 0,
                  }}
                >
                  {admin.first_name[0]}{admin.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>
                      {admin.first_name} {admin.last_name}
                    </span>
                    <span
                      className="flex items-center gap-1"
                      style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px",
                        borderRadius: "20px",
                        background: admin.role === "super_admin" ? "#f3e8ff" : "#eff6ff",
                        color: admin.role === "super_admin" ? "#7c3aed" : "#2563eb",
                      }}
                    >
                      {admin.role === "super_admin" ? (
                        <><ShieldCheck width={11} height={11} />Super Admin</>
                      ) : (
                        <><Shield width={11} height={11} />Admin</>
                      )}
                    </span>
                    {!admin.is_active && (
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px",
                        borderRadius: "20px", background: "#fef2f2", color: "#dc2626",
                      }}>
                        Deactivated
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-4)", marginTop: "2px" }}>
                    {admin.email}
                  </div>
                </div>
              </div>

              {/* Actions — don't show for super admin */}
              {admin.role !== "super_admin" && (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                  <button
                    onClick={() => handleToggleActive(admin)}
                    className="flex items-center gap-1.5 cursor-pointer"
                    style={{
                      height: "30px", padding: "0 10px",
                      border: `1px solid ${admin.is_active ? "#fecaca" : "var(--c-border)"}`,
                      borderRadius: "7px", background: "var(--c-bg-elevated)",
                      fontSize: "12px", fontWeight: 550,
                      color: admin.is_active ? "#dc2626" : "var(--c-text-2)",
                    }}
                  >
                    {admin.is_active ? (
                      <><UserX width={13} height={13} />Deactivate</>
                    ) : (
                      <><UserCheck width={13} height={13} />Activate</>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE DRAWER ── */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "400px", maxWidth: "100vw",
              background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)",
              animation: "slideInRight 0.2s ease",
            }}
          >
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>
                Add Admin
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer"
                style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}
              >
                <X width={18} height={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex-1 overflow-auto flex flex-col">
              <div style={{ padding: "20px", flex: 1 }}>
                <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input style={inputStyle} placeholder="Jane" value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })} autoFocus />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input style={inputStyle} placeholder="Doe" value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" placeholder="jane@meridian.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} placeholder="+8801700000000" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Password *</label>
                  <input style={inputStyle} type="password" placeholder="Min 8 chars, 1 upper, 1 lower, 1 number" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div style={{
                  padding: "10px 12px", background: "var(--c-bg-surface)",
                  border: "1px solid var(--c-border)", borderRadius: "8px",
                  fontSize: "12px", color: "var(--c-text-3)",
                }}>
                  New user will be created with <strong style={{ color: "#2563eb" }}>Admin</strong> role.
                </div>
              </div>
              <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
                <button type="button" onClick={() => setDrawerOpen(false)} className="flex-1 cursor-pointer"
                  style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.first_name || !form.last_name || !form.email || !form.password}
                  className="flex-1 flex items-center justify-center cursor-pointer"
                  style={{
                    height: "38px", border: "none", borderRadius: "9px",
                    background: saving || !form.first_name || !form.last_name || !form.email || !form.password ? "#93c5fd" : "#2563eb",
                    fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px",
                  }}
                >
                  {saving && <Loader2 width={14} height={14} className="animate-spin" />}
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
