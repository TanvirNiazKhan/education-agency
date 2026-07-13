"use client";

import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
      }}
    >
      {/* Minimal header */}
      <header
        style={{
          height: 66,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid var(--color-line)",
          background: "rgba(255,255,255,.82)",
          backdropFilter: "saturate(180%) blur(16px)",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #4f7bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm0 12.27L5.47 12 12 8.72 18.53 12 12 15.27z"
                fill="#fff"
              />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-.02em", color: "var(--color-navy)" }}>
            Odyssey
          </span>
        </Link>
      </header>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
