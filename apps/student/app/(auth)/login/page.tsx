"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/lib/api";
import { useAuth } from "@/app/contexts/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      setAuth(res.access_token, res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 46,
    padding: "0 14px",
    fontSize: 15,
    border: "1.5px solid var(--color-line)",
    borderRadius: 10,
    background: "#fff",
    color: "var(--color-ink)",
    transition: "border-color .15s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--color-sub)",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      className="animate-fadeUp"
      style={{
        width: "100%",
        maxWidth: 440,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-md)",
        padding: "40px 36px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-muted)", marginTop: 8 }}>
          Sign in to continue your journey
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "var(--color-red)",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={{ ...inputStyle, paddingRight: 44 }}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-muted)",
                padding: 0,
                display: "flex",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="lift-hover"
          style={{
            width: "100%",
            height: 48,
            borderRadius: 11,
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #4f7bff)",
            color: "#fff",
            fontSize: 15.5,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "opacity .15s",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--color-muted)",
          marginTop: 24,
          marginBottom: 0,
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "var(--color-blue)", fontWeight: 600, textDecoration: "none" }}
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
