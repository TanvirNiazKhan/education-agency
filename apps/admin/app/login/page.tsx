"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "../../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--c-bg)" }}
    >
      <div
        className="w-full max-w-[400px] rounded-[14px] p-8"
        style={{
          background: "var(--c-bg-elevated)",
          border: "1px solid var(--c-border)",
          boxShadow: "0 4px 24px var(--c-shadow)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-[10px] mb-8">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "36px",
              height: "36px",
              background: "#2563eb",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--c-text-1)",
              }}
            >
              Meridian
            </div>
            <div style={{ fontSize: "12px", color: "var(--c-text-4)" }}>
              Admin Portal
            </div>
          </div>
        </div>

        <h1
          className="text-center mb-1"
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--c-text-1)",
            margin: 0,
          }}
        >
          Sign in
        </h1>
        <p
          className="text-center mb-6"
          style={{ fontSize: "13px", color: "var(--c-text-4)", margin: "6px 0 24px" }}
        >
          Enter your credentials to access the admin panel
        </p>

        {error && (
          <div
            className="mb-4 rounded-[9px] px-3 py-2.5 text-[13px]"
            style={{
              background: "var(--color-error-light, #fef2f2)",
              color: "var(--color-error, #dc2626)",
              border: "1px solid rgba(220, 38, 38, 0.15)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--c-text-2)",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@meridian.com"
              required
              className="h-[38px] rounded-[9px] px-3 text-[13.5px] outline-none"
              style={{
                border: "1px solid var(--c-border-input)",
                background: "var(--c-bg-input)",
                color: "var(--c-text-1)",
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--c-text-2)",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="h-[38px] rounded-[9px] px-3 text-[13.5px] outline-none"
              style={{
                border: "1px solid var(--c-border-input)",
                background: "var(--c-bg-input)",
                color: "var(--c-text-1)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-[40px] rounded-[9px] border-none text-[14px] font-semibold text-white cursor-pointer mt-1"
            style={{
              background: loading ? "#93b4f5" : "#2563eb",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
