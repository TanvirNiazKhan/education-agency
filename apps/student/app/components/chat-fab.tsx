"use client";

import Link from "next/link";

export default function ChatFab() {
  return (
    <Link
      href="/chat"
      aria-label="Open AI Chat"
      className="animate-ring hidden md:flex w-[60px] h-[60px] right-[26px] bottom-[80px]"
      style={{
        position: "fixed",
        zIndex: 70,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--color-blue), #4f7bff)",
        boxShadow: "0 12px 30px -8px rgba(37,99,235,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform .15s",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"
          fill="#fff"
          fillOpacity=".95"
        />
        <circle cx="9.5" cy="12" r="1.5" fill="#2563eb" />
        <circle cx="14" cy="12" r="1.5" fill="#2563eb" />
        <circle cx="18.5" cy="12" r="1.5" fill="#2563eb" />
      </svg>
    </Link>
  );
}
