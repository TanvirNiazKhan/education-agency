"use client";

import Link from "next/link";

interface AiAssistantTabProps {
  universityName: string;
}

export default function AiAssistantTab({ universityName }: AiAssistantTabProps) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          background: "linear-gradient(135deg,#0a1330,#16224e)",
          borderRadius: 20,
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          Ask about {universityName}
        </h2>
        <p
          style={{
            fontSize: 14.5,
            color: "rgba(255,255,255,.65)",
            lineHeight: 1.65,
            margin: "0 0 28px",
          }}
        >
          Get instant answers about admission requirements, scholarships, campus
          life, and more — powered by AI trained on official university data.
        </p>
        <Link
          href="/chat"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#0a1330",
            fontSize: 14.5,
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: 12,
            textDecoration: "none",
            transition: "opacity .15s",
          }}
        >
          Open AI chat
        </Link>
      </div>
    </div>
  );
}
