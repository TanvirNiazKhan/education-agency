"use client";

import Link from "next/link";
import { ApiUniversity } from "./types";

interface ActionBarProps {
  university: ApiUniversity;
  tuitionDisplay: string;
}

export default function ActionBar({ university, tuitionDisplay }: ActionBarProps) {
  return (
    <div
      className="px-4 lg:px-7 bottom-[56px] md:bottom-0"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        zIndex: 55,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--color-line)",
        paddingTop: 12,
        paddingBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="hidden lg:block">
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-navy)",
          }}
        >
          {university.name}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
          Tuition from {tuitionDisplay}/yr
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-2.5 flex-wrap">
        <button
          className="hidden md:inline-flex"
          style={{
            padding: "9px 18px",
            borderRadius: 10,
            border: "1.5px solid var(--color-line)",
            background: "transparent",
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--color-sub)",
            cursor: "pointer",
            alignItems: "center",
            gap: 6,
          }}
        >
          ⇄ Compare
        </button>
        <Link
          href="/chat"
          style={{
            padding: "9px 18px",
            borderRadius: 10,
            background: "var(--color-blue-x)",
            color: "var(--color-blue)",
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ✦ Ask AI
        </Link>
        <Link
          href={`/apply?university_id=${university.id}`}
          style={{
            padding: "9px 22px",
            borderRadius: 10,
            border: "none",
            background: "var(--color-blue)",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Apply now
        </Link>
      </div>
    </div>
  );
}
