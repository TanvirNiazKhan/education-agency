"use client";

import Link from "next/link";
import { CHAT_TOPICS } from "../../lib/data";
import { useAuth } from "../../contexts/auth-context";

const recentChats = [
  { label: "Scholarships for CS", time: "2h ago" },
  { label: "Australia vs Canada", time: "1d ago" },
  { label: "PTE-friendly universities", time: "3d ago" },
];

const starterPrompts = [
  "Suggest universities for my CGPA",
  "How to get a scholarship?",
  "Australia vs Canada for CS?",
];

export default function ChatPage() {
  const { user } = useAuth();
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100dvh - 66px)",
        overflow: "hidden",
      }}
    >
      {/* Left sidebar */}
      <div
        className="hidden lg:flex"
        style={{
          width: 270,
          background: "var(--color-card)",
          borderRight: "1px solid var(--color-line)",
          flexDirection: "column",
          padding: "22px 18px",
          flexShrink: 0,
          overflow: "auto",
        }}
      >
        {/* New conversation button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "12px 0",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 28,
          }}
          className="lift-hover"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </svg>
          New conversation
        </button>

        {/* Suggested topics */}
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              marginBottom: 14,
            }}
          >
            Suggested topics
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CHAT_TOPICS.map((t) => (
              <button
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background .15s",
                }}
                className="spotrow"
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: t.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {t.icon}
                </div>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              marginBottom: 14,
            }}
          >
            Recent
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recentChats.map((c) => (
              <button
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background .15s",
                }}
                className="spotrow"
              >
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                    flexShrink: 0,
                    marginLeft: 8,
                  }}
                >
                  {c.time}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom card */}
        <div
          style={{
            background: "var(--color-line-2)",
            borderRadius: 14,
            padding: "18px 16px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--color-ink)",
              marginBottom: 4,
            }}
          >
            Ready to apply?
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-muted)",
              marginBottom: 14,
            }}
          >
            Your profile is 60% complete
          </div>
          <Link
            href="/apply"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              padding: "10px 0",
              borderRadius: 10,
              textDecoration: "none",
            }}
            className="lift-hover"
          >
            Continue application
          </Link>
        </div>
      </div>

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header bar */}
        <div
          className="px-4 lg:px-7 gap-3 lg:gap-3.5"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: "1px solid var(--color-line)",
            display: "flex",
            alignItems: "center",
            background: "var(--color-card)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--color-ink)",
              }}
            >
              AI Admission Counsellor
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--color-muted)",
                marginTop: 1,
              }}
            >
              {user ? `Personalised to ${user.first_name}` : "Personalised to you"}
            </div>
          </div>
          <Link
            href="/apply"
            className="lift-hover"
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              padding: "9px 20px",
              borderRadius: 10,
              textDecoration: "none",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="lg:hidden" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden lg:inline">Start application</span>
          </Link>
        </div>

        {/* Chat messages area */}
        <div
          className="px-4 lg:px-7 pt-6 lg:pt-8"
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* AI greeting message */}
          <div style={{ display: "flex", gap: 14, maxWidth: 640 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              ✦
            </div>
            <div
              style={{
                background: "var(--color-card)",
                borderRadius: "4px 18px 18px 18px",
                padding: "18px 22px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--color-line)",
              }}
            >
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--color-ink)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Hi{user ? ` ${user.first_name}` : ""} 👋 I&apos;m your AI admission counsellor. Tell me about
                yourself — your CGPA, budget, or where you&apos;d like to study —
                and I&apos;ll build a shortlist for you.
              </p>
            </div>
          </div>

          {/* Starter prompt chips */}
          <div
            className="ml-0 lg:ml-12 gap-2 lg:gap-2.5"
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            {starterPrompts.map((p) => (
              <button
                key={p}
                className="chip-hover text-xs lg:text-[13.5px]"
                style={{
                  padding: "10px 16px",
                  borderRadius: 20,
                  border: "1.5px solid var(--color-line)",
                  background: "var(--color-card)",
                  fontWeight: 600,
                  color: "var(--color-sub)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input area at bottom */}
        <div
          className="px-4 lg:px-7"
          style={{
            paddingTop: 18,
            paddingBottom: 22,
            borderTop: "1px solid var(--color-line)",
            background: "var(--color-card)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--color-bg)",
              borderRadius: 14,
              border: "1.5px solid var(--color-line)",
              padding: "0 6px 0 18px",
              height: 52,
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about admissions..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 14.5,
                color: "var(--color-ink)",
                height: "100%",
              }}
            />
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
