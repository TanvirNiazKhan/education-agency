"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Check } from "lucide-react";
import { authApi } from "@/lib/api";
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

export default function SettingsPage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
          Settings
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>
          Manage your account settings
        </p>
      </div>

      <div style={{ maxWidth: "480px" }}>
        {/* Profile Info */}
        <div
          style={{
            padding: "18px 20px", marginBottom: "20px",
            border: "1px solid var(--c-border)", borderRadius: "14px",
            background: "var(--c-bg-elevated)",
          }}
        >
          <h2 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 600, color: "var(--c-text-1)" }}>
            Profile
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "2px" }}>Name</div>
              <div style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>
                {user?.first_name} {user?.last_name}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "2px" }}>Role</div>
              <div style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>
                {user?.role === "super_admin" ? "Super Admin" : "Admin"}
              </div>
            </div>
            <div className="col-span-2">
              <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "2px" }}>Email</div>
              <div style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div
          style={{
            padding: "18px 20px",
            border: "1px solid var(--c-border)", borderRadius: "14px",
            background: "var(--c-bg-elevated)",
          }}
        >
          <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 600, color: "var(--c-text-1)" }}>
            Change Password
          </h2>

          {error && (
            <div
              className="mb-3 rounded-[9px] px-3 py-2.5 text-[13px]"
              style={{
                background: "#fef2f2", color: "#dc2626",
                border: "1px solid rgba(220, 38, 38, 0.15)",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-3 flex items-center gap-2 rounded-[9px] px-3 py-2.5 text-[13px]"
              style={{
                background: "#ecfdf3", color: "#16a34a",
                border: "1px solid rgba(22, 163, 74, 0.15)",
              }}
            >
              <Check width={14} height={14} />
              {success}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                style={inputStyle} type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                style={inputStyle} type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                style={inputStyle} type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center justify-center gap-2 cursor-pointer"
              style={{
                height: "38px", border: "none", borderRadius: "9px",
                background: saving || !currentPassword || !newPassword || !confirmPassword ? "#93c5fd" : "#2563eb",
                fontSize: "13px", fontWeight: 550, color: "#fff",
              }}
            >
              {saving && <Loader2 width={14} height={14} className="animate-spin" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
