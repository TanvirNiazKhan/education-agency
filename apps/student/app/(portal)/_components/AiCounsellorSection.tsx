"use client";

import Link from "next/link";

interface AiCounsellorSectionProps {
  prompts: string[];
}

export default function AiCounsellorSection({ prompts }: AiCounsellorSectionProps) {
  return (
    <div
      className="animate-fadeUp"
      style={{
        maxWidth: 760,
        margin: "36px auto 0",
        padding: "0 0 0",
        animationDelay: ".42s",
      }}
    >
      <div
        className="p-5 md:p-7"
        style={{
          background: "linear-gradient(135deg,#0a1330,#16224e)",
          borderRadius: 22,
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,130,255,.25),transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Row */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center"
          style={{
            gap: 16,
            position: "relative",
          }}
        >
          {/* AI star icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg,#6382ff,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74z" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 16.5,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              Ask the AI counsellor anything
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "rgba(255,255,255,.55)",
                marginTop: 2,
              }}
            >
              University fit, scholarships, visa strategy, SOP review
            </div>
          </div>

          <Link
            href="/chat"
            className="w-full md:w-auto text-center"
            style={{
              padding: "10px 22px",
              borderRadius: 12,
              background: "#fff",
              color: "var(--color-navy)",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Open chat
          </Link>
        </div>

        {/* AI prompt chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 18,
            position: "relative",
          }}
        >
          {prompts.map((p) => (
            <Link
              key={p}
              href="/chat"
              style={{
                padding: "7px 16px",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,.12)",
                background: "rgba(255,255,255,.06)",
                color: "rgba(255,255,255,.72)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,.06)")
              }
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
