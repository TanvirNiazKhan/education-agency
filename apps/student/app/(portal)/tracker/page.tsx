"use client";

import Link from "next/link";
import { TRACKER_STEPS } from "../../lib/data";

export default function TrackerPage() {
  return (
    <main className="px-4 py-6 pb-[120px] md:pb-16 lg:px-7 lg:py-8 lg:pb-[90px]" style={{ maxWidth: 820, margin: "0 auto" }}>
      {/* Header */}
      <h1
        className="text-2xl lg:text-[30px]"
        style={{
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: 0,
        }}
      >
        Application tracker
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--color-sub)",
          margin: "6px 0 22px",
          lineHeight: 1.55,
        }}
      >
        Track every step of your application — from submission to visa.
      </p>

      {/* Summary card */}
      <div
        style={{
          background: "linear-gradient(135deg,#0a1330,#16224e)",
          borderRadius: 20,
          padding: 24,
          color: "#fff",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative green glow */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(15,157,88,.3),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4" style={{ position: "relative" }}>
          {/* Badge + info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              M
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginBottom: 2 }}>
                University of Melbourne
              </div>
              <div className="text-base sm:text-lg" style={{ fontWeight: 800, lineHeight: 1.3 }}>
                MS Computer Science &middot; Feb 2026 intake
              </div>
            </div>
          </div>
          <span
            className="self-start sm:self-auto"
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "#34d399",
              background: "rgba(15,157,88,.18)",
              padding: "6px 14px",
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            Offer received 🎉
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="p-5 lg:px-7 lg:pt-7 lg:pb-6 mb-6"
        style={{
          background: "var(--color-card)",
          borderRadius: 20,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {TRACKER_STEPS.map((step, i) => {
          const isLast = i === TRACKER_STEPS.length - 1;
          const isCurrent = "current" in step && step.current;

          return (
            <div
              key={i}
              style={{ display: "flex", gap: 18, position: "relative" }}
            >
              {/* Left: dot + line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 34,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    ...(step.done
                      ? isCurrent
                        ? { background: "var(--color-blue)" }
                        : { background: "var(--color-green)" }
                      : {
                          background: "#fff",
                          border: "2.5px solid var(--color-line)",
                        }),
                  }}
                  className={isCurrent ? "animate-ring" : undefined}
                >
                  {step.done && !isCurrent && (
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke="#fff"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isCurrent && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#fff",
                      }}
                    />
                  )}
                </div>
                {/* Connecting line */}
                {!isLast && (
                  <div
                    style={{
                      width: 2.5,
                      flex: 1,
                      minHeight: 20,
                      background:
                        step.done && !isCurrent
                          ? "var(--color-green)"
                          : "var(--color-line)",
                      borderRadius: 2,
                    }}
                  />
                )}
              </div>

              {/* Right: content card */}
              <div
                style={{
                  flex: 1,
                  paddingBottom: isLast ? 0 : 20,
                }}
              >
                <div
                  style={{
                    background: isCurrent
                      ? "rgba(37,99,235,.06)"
                      : step.done
                        ? "var(--color-card)"
                        : "var(--color-bg)",
                    border: isCurrent
                      ? "1.5px solid rgba(37,99,235,.22)"
                      : "1.5px solid transparent",
                    borderRadius: 14,
                    padding: "14px 18px",
                    opacity: step.done ? 1 : 0.55,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15.5,
                        fontWeight: 800,
                        color: isCurrent
                          ? "var(--color-blue)"
                          : step.done
                            ? "var(--color-ink)"
                            : "var(--color-muted)",
                      }}
                    >
                      {step.label}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
                      {step.date}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--color-sub)",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5">
        <Link
          href="/chat"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 14.5,
            fontWeight: 700,
            color: "var(--color-blue-d)",
            background: "var(--color-blue-x)",
            border: "1.5px solid var(--color-blue-2)",
            borderRadius: 14,
            padding: "14px 20px",
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="chip-hover"
        >
          ✦ Ask AI about my visa
        </Link>
        <Link
          href="/dashboard"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14.5,
            fontWeight: 700,
            color: "#fff",
            background: "var(--color-blue)",
            borderRadius: 14,
            padding: "14px 20px",
            textDecoration: "none",
            cursor: "pointer",
            border: "none",
          }}
          className="lift-hover"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
