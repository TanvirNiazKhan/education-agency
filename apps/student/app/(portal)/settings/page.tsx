"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { changePassword, uploadAvatar } from "../../lib/api";

const API_STATIC = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "");

function avatarSrc(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_STATIC}${url}`;
}

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth();

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setAvatarUploading(true);
    setAvatarError("");
    setAvatarSuccess(false);
    try {
      const result = await uploadAvatar(token, file);
      updateUser({ avatar_url: result.avatar_url });
      setAvatarSuccess(true);
    } catch (err: any) {
      setAvatarError(err.message || "Upload failed");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPassword !== confirmPassword) { setPwError("New passwords do not match"); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    if (!token) return;
    setPwSaving(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwError(err.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  }

  const avatarUrl = avatarSrc(user?.avatar_url);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px 60px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 6px" }}>
        Account Settings
      </h1>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Manage your profile photo and security settings.
      </p>

      {/* ── Profile Photo ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--color-line)",
          borderRadius: 16,
          padding: "24px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy)", marginBottom: 20 }}>
          Profile Photo
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar preview */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0f9d58, #16b364)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
              flexShrink: 0,
              overflow: "hidden",
              border: "3px solid var(--color-line)",
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)", marginBottom: 2 }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 14 }}>
              {user?.email}
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-blue)",
                background: "var(--color-blue-x)",
                border: "none",
                borderRadius: 10,
                cursor: avatarUploading ? "not-allowed" : "pointer",
                opacity: avatarUploading ? 0.6 : 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {avatarUploading ? "Uploading…" : "Upload photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                disabled={avatarUploading}
                onChange={handleAvatarChange}
              />
            </label>
            {avatarError && (
              <div style={{ fontSize: 12, color: "var(--color-red)", marginTop: 6 }}>{avatarError}</div>
            )}
            {avatarSuccess && (
              <div style={{ fontSize: 12, color: "#15803d", marginTop: 6 }}>Photo updated.</div>
            )}
            <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginTop: 6 }}>
              JPEG, PNG or WebP · max 5 MB
            </div>
          </div>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--color-line)",
          borderRadius: 16,
          padding: "24px",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy)", marginBottom: 20 }}>
          Change Password
        </div>

        <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((s) => !s)}
          />

          <div style={{ height: 1, background: "var(--color-line)" }} />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((s) => !s)}
            hint="At least 8 characters"
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
          />

          {pwError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {pwError}
            </div>
          )}

          {pwSuccess && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Password updated successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
            style={{
              alignSelf: "flex-start",
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: pwSaving || !currentPassword || !newPassword || !confirmPassword
                ? "#94a3b8"
                : "linear-gradient(135deg, #2563eb, #4f7bff)",
              border: "none",
              borderRadius: 11,
              cursor: pwSaving || !currentPassword || !newPassword || !confirmPassword ? "not-allowed" : "pointer",
            }}
          >
            {pwSaving ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  hint?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "11px 44px 11px 14px",
            fontSize: 14,
            color: "var(--color-ink)",
            background: "var(--color-line-2)",
            border: "1.5px solid var(--color-line)",
            borderRadius: 11,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            padding: 2,
            display: "flex",
          }}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {hint && <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
