"use client";

import Link from "next/link";
import { UNIS, DOCS, NOTIFS } from "../../lib/data";

const progressSteps = [
  { label: "Profile", done: true },
  { label: "Documents", done: true },
  { label: "Review", done: false, current: true },
  { label: "Submit", done: false },
  { label: "Offer", done: false },
];

const tasks = [
  { text: "Upload IELTS/PTE score", due: "Due in 3 days", dueColor: "#e0492e", dueBg: "#fdecea", done: false },
  { text: "Review SOP draft", due: "Due in 5 days", dueColor: "#e08a1e", dueBg: "#fdf3e6", done: false },
  { text: "Submit Melbourne application", due: "Due in 2 weeks", dueColor: "#2563eb", dueBg: "#eff4ff", done: false },
  { text: "Book PTE exam", due: "Completed", dueColor: "#0f9d58", dueBg: "#e9f9ef", done: true },
];

/* SVG circle progress helpers */
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.6;

export default function DashboardPage() {
  return (
    <main className="px-4 py-6 pb-[120px] md:pb-16 lg:px-7 lg:py-8 lg:pb-[90px]" style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* ───── Top section ───── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6"
      >
        {/* Left: welcome */}
        <div>
          <h1
            className="text-2xl lg:text-[30px]"
            style={{ fontWeight: 800, color: "var(--color-navy)", margin: 0 }}
          >
            Welcome back, Ayaan 👋
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-sub)",
              margin: "6px 0 20px",
              lineHeight: 1.55,
            }}
          >
            You&apos;re closer than you think. Finish 2 tasks to unlock your best-match
            applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5">
            {/* Blue action card */}
            <Link
              href="/apply"
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                borderRadius: 16,
                padding: "20px 22px",
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
              className="lift-hover"
            >
              <span style={{ fontSize: 14.5, fontWeight: 700, opacity: 0.92 }}>
                Continue where you left off
              </span>
              <span style={{ fontSize: 13, opacity: 0.78, marginTop: 8 }}>
                Application &middot; Step 3 of 7 &rarr;
              </span>
            </Link>

            {/* Dark help card */}
            <Link
              href="/chat"
              className="w-full sm:w-[150px]"
              style={{
                background: "linear-gradient(135deg,#0a1330,#16224e)",
                borderRadius: 16,
                padding: "20px 18px",
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.92 }}>
                Need help?
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Ask AI ✦</span>
            </Link>
          </div>
        </div>

        {/* Right: profile completion */}
        <div
          className="flex flex-row lg:flex-col items-center lg:justify-center gap-4 lg:gap-0 lg:text-center"
          style={{
            background: "var(--color-card)",
            borderRadius: 18,
            boxShadow: "var(--shadow-sm)",
            padding: "28px 24px",
          }}
        >
          <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx={44}
              cy={44}
              r={RADIUS}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth={7}
            />
            <circle
              cx={44}
              cy={44}
              r={RADIUS}
              fill="none"
              stroke="var(--color-blue)"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - PROGRESS)}
            />
          </svg>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-navy)",
              marginTop: -58,
              marginBottom: 38,
            }}
          >
            60%
          </span>
          <div className="flex flex-col">
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>
              Profile completion
            </span>
            <span
              style={{ fontSize: 13, color: "var(--color-muted)", margin: "4px 0 12px" }}
            >
              Complete your profile to get better university matches
            </span>
            <Link
              href="/profile"
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--color-blue)",
                textDecoration: "none",
              }}
            >
              Complete profile &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ───── Main grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Application progress */}
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              padding: "24px 26px 28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>
                Application progress
              </span>
              <Link
                href="/tracker"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-blue)",
                  textDecoration: "none",
                }}
              >
                View tracker &rarr;
              </Link>
            </div>

            {/* Steps */}
            <div
              className="overflow-x-auto"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              {progressSteps.map((s, i) => {
                const isLast = i === progressSteps.length - 1;
                return (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      position: "relative",
                    }}
                  >
                    {/* line */}
                    {!isLast && (
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          left: "50%",
                          width: "100%",
                          height: 3,
                          background:
                            s.done
                              ? "var(--color-green)"
                              : "var(--color-line)",
                          zIndex: 0,
                        }}
                      />
                    )}
                    {/* dot */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        position: "relative",
                        zIndex: 1,
                        ...(s.done
                          ? { background: "var(--color-green)" }
                          : s.current
                            ? { background: "var(--color-blue)" }
                            : {
                                background: "#fff",
                                border: "2.5px solid var(--color-line)",
                                color: "var(--color-muted)",
                              }),
                      }}
                    >
                      {s.done ? (
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3.5 8.5L6.5 11.5L12.5 5"
                            stroke="#fff"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : s.current ? (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#fff",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--color-line)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: s.done
                          ? "var(--color-green)"
                          : s.current
                            ? "var(--color-blue)"
                            : "var(--color-muted)",
                        marginTop: 8,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved universities */}
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              padding: "24px 26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>
                Saved universities
              </span>
              <span style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600 }}>
                3 saved
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {UNIS.slice(0, 3).map((u) => (
                <Link
                  href={`/university/${u.id}`}
                  key={u.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: 14,
                    transition: "background .15s",
                  }}
                  className="spotrow"
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: u.img,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: "var(--color-ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {u.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                      {u.city}, {u.country} &middot; Rank #{u.rank}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--color-green)",
                      background: "var(--color-green-bg)",
                      padding: "4px 10px",
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    {u.match}%
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div
            style={{
              background: "linear-gradient(135deg,#0a1330,#16224e)",
              borderRadius: 18,
              padding: "26px 28px",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle,rgba(37,99,235,.35),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>⭐</span>
              <span style={{ fontSize: 15, fontWeight: 800 }}>AI recommendation</span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                opacity: 0.88,
                margin: "0 0 18px",
              }}
            >
              Based on your profile, Monash University is a strong under-the-radar match
              &mdash; 87% fit with a 25% merit scholarship you likely qualify for.
            </p>
            <Link
              href="/university/monash"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--color-navy)",
                background: "#fff",
                padding: "9px 18px",
                borderRadius: 10,
                textDecoration: "none",
              }}
              className="lift-hover"
            >
              See why it fits &rarr;
            </Link>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upcoming tasks */}
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              padding: "24px 22px",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-ink)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Upcoming tasks
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {tasks.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: t.done ? "none" : "2px solid var(--color-line)",
                      background: t.done ? "var(--color-green)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {t.done && (
                      <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 5"
                          stroke="#fff"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: t.done ? "var(--color-muted)" : "var(--color-ink)",
                        textDecoration: t.done ? "line-through" : "none",
                      }}
                    >
                      {t.text}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: t.dueColor,
                        background: t.dueBg,
                        padding: "2px 8px",
                        borderRadius: 8,
                        marginTop: 4,
                        display: "inline-block",
                      }}
                    >
                      {t.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document center */}
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              padding: "24px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>
                Document center
              </span>
              <Link
                href="/documents"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-blue)",
                  textDecoration: "none",
                }}
              >
                Open &rarr;
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DOCS.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "6px 0",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: d.tint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: d.color,
                      flexShrink: 0,
                    }}
                  >
                    {d.ic}
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--color-ink)",
                    }}
                  >
                    {d.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: d.color,
                      background: d.bg,
                      padding: "3px 10px",
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              boxShadow: "var(--shadow-sm)",
              padding: "24px 22px",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-ink)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Notifications
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {NOTIFS.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: n.dot,
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 13.5, fontWeight: 700, color: "var(--color-ink)" }}
                    >
                      {n.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-muted)",
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {n.sub}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-muted)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {n.when}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
