"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UNIS,
  COURSES,
  DESTINATIONS,
  INTAKES,
  SCHOLARSHIPS,
  STORIES,
  VISAS,
  SUGGEST_CHIPS,
  AI_PROMPTS,
} from "../lib/data";

const ROTATING_WORDS = ["abroad", "in Australia", "in Canada", "in the UK"];

export default function HomePage() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING_WORDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const currentWord = ROTATING_WORDS[wordIdx];

  return (
    <>
      {/* ───── HERO ───── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(120% 130% at 50% -20%,#eef3ff 0%,#f6f7fa 55%)",
        }}
      >
        {/* Orbs */}
        <div
          className="animate-drift"
          style={{
            position: "absolute",
            top: -80,
            left: "8%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(37,99,235,.16),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-driftB"
          style={{
            position: "absolute",
            top: 40,
            right: "6%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(15,157,88,.14),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-drift-slow"
          style={{
            position: "absolute",
            bottom: -60,
            left: "38%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(107,155,255,.15),transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Hero inner */}
        <div
          className="px-4 md:px-7 pt-8 md:pt-[52px] pb-6 md:pb-9"
          style={{
            maxWidth: 920,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Welcome badge */}
          <div
            className="animate-fadeUp"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 6px 6px 14px",
              background: "#fff",
              border: "1px solid var(--color-line)",
              borderRadius: 100,
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--color-sub)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span
              className="animate-blink"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-green)",
                display: "inline-block",
              }}
            />
            Welcome back, Ayaan
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                background: "var(--color-blue-x)",
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--color-blue)",
              }}
            >
              ✦ AI counsellor online
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-fadeUp text-[32px] md:text-[52px]"
            style={{
              lineHeight: 1.05,
              letterSpacing: "-.035em",
              fontWeight: 800,
              color: "var(--color-navy)",
              margin: "20px 0 12px",
              animationDelay: ".06s",
            }}
          >
            Ready to study
            <br />
            <span style={{ color: "var(--color-blue)" }}>{currentWord}</span>
            <span
              className="animate-caret"
              style={{
                display: "inline-block",
                width: 3,
                height: 46,
                background: "var(--color-blue)",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                borderRadius: 2,
              }}
            />
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fadeUp text-[16px] md:text-[18px]"
            style={{
              color: "var(--color-sub)",
              maxWidth: 520,
              margin: "0 auto 28px",
              animationDelay: ".12s",
            }}
          >
            Pick up where you left off, or search 12,000+ programs. Your
            personal counsellor handles the rest.
          </p>

          {/* Search box */}
          <div
            className="lift-hover animate-fadeUp"
            style={{ maxWidth: 660, margin: "0 auto", animationDelay: ".18s" }}
          >
            <Link
              href="/search"
              className="h-14 md:h-[66px]"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 10px 0 22px",
                background: "#fff",
                border: "1px solid var(--color-line)",
                borderRadius: 18,
                boxShadow: "var(--shadow-lg)",
                cursor: "text",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* Search icon */}
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <span
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "var(--color-muted)",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Search &quot;{currentWord}&quot;
                <span
                  className="animate-caret"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 20,
                    background: "var(--color-blue)",
                    marginLeft: 1,
                    borderRadius: 2,
                  }}
                />
              </span>

              <span
                className="h-10 md:h-[46px] px-4 md:px-[22px]"
                style={{
                  borderRadius: 12,
                  background: "var(--color-blue)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                Search
              </span>
            </Link>
          </div>

          {/* Suggest chips */}
          <div
            className="animate-fadeUp flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible justify-start md:justify-center"
            style={{
              gap: 8,
              marginTop: 16,
              animationDelay: ".24s",
            }}
          >
            {SUGGEST_CHIPS.map((ch) => (
              <Link
                key={ch}
                href="/search"
                className="chip-hover whitespace-nowrap"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 14px",
                  background: "#fff",
                  border: "1px solid var(--color-line)",
                  borderRadius: 100,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--color-sub)",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {ch}
              </Link>
            ))}
          </div>

          {/* Resume application strip */}
          <Link
            href="/university/melb"
            className="lift-hover animate-fadeUp flex flex-col md:flex-row items-stretch md:items-center"
            style={{
              maxWidth: 620,
              margin: "26px auto 0",
              gap: 16,
              padding: "14px 18px",
              background: "#fff",
              border: "1px solid var(--color-line)",
              borderRadius: 16,
              boxShadow: "var(--shadow-sm)",
              textDecoration: "none",
              color: "inherit",
              animationDelay: ".30s",
            }}
          >
            {/* Badge + Middle row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
            <div
              className="animate-floatY"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              M
            </div>

            {/* Middle */}
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  color: "var(--color-blue-d)",
                  marginBottom: 2,
                }}
              >
                Continue your application
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                }}
              >
                University of Melbourne &middot; MS Computer Science
              </div>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: 8,
                  height: 5,
                  borderRadius: 100,
                  background: "var(--color-line)",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    borderRadius: 100,
                    background:
                      "linear-gradient(90deg,var(--color-blue),#60a5fa)",
                  }}
                />
              </div>
            </div>
            </div>

            {/* Resume button */}
            <span
              className="w-full md:w-auto text-center"
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                background: "var(--color-blue)",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              Resume&nbsp;&rarr;
            </span>
          </Link>

          {/* Trust stats */}
          <div
            className="animate-fadeUp grid grid-cols-3"
            style={{
              maxWidth: 520,
              margin: "32px auto 0",
              animationDelay: ".36s",
            }}
          >
            {[
              { n: "2,400+", l: "students placed" },
              { n: "$18M", l: "scholarships won" },
              { n: "98%", l: "visa success" },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  textAlign: "center",
                  padding: "0 16px",
                  borderLeft:
                    i > 0 ? "1px solid var(--color-line)" : "none",
                }}
              >
                <div
                  className="text-[20px] md:text-[26px]"
                  style={{
                    fontWeight: 800,
                    color: "var(--color-navy)",
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[11px] md:text-[12.5px]"
                  style={{
                    color: "var(--color-muted)",
                    marginTop: 2,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* AI Entry */}
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
                {AI_PROMPTS.map((p) => (
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
        </div>
      </section>

      {/* ───── CONTENT SECTIONS ───── */}
      <div
        className="px-4 md:px-7 pb-[60px] md:pb-[90px]"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          paddingTop: 8,
        }}
      >
        {/* ── Personalized recommendations ── */}
        <section style={{ marginTop: 44 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  background: "var(--color-blue-x)",
                  borderRadius: 100,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--color-blue)",
                  marginBottom: 10,
                }}
              >
                ✦ For you, Ayaan
              </span>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 4px",
                }}
              >
                Recommended for your profile
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--color-sub)",
                  margin: 0,
                }}
              >
                Based on your CGPA 3.45, budget ৳40L, and preferred destinations
              </p>
            </div>
            <Link
              href="/chat"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-blue)",
                textDecoration: "none",
              }}
            >
              Refine with AI &rarr;
            </Link>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px]"
          >
            {UNIS.slice(0, 3).map((u) => (
              <Link
                key={u.id}
                href={`/university/${u.id}`}
                className="card-hover"
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--color-line)",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    height: 120,
                    background: u.img,
                    position: "relative",
                    padding: 14,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "var(--color-green)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {u.match}% match
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "rgba(0,0,0,.45)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    #{u.rank}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-muted)",
                      marginBottom: 4,
                    }}
                  >
                    {u.city}, {u.country}
                  </div>
                  <div
                    style={{
                      fontSize: 16.5,
                      fontWeight: 800,
                      color: "var(--color-navy)",
                    }}
                  >
                    {u.name}
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: "var(--color-line)",
                      margin: "14px 0",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          textTransform: "uppercase",
                          letterSpacing: ".04em",
                          marginBottom: 2,
                        }}
                      >
                        Tuition / year
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "var(--color-navy)",
                        }}
                      >
                        {u.tuition}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "var(--color-green-bg)",
                        color: "var(--color-green)",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {u.schShort}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular destinations ── */}
        <section style={{ marginTop: 52 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-navy)",
              marginBottom: 18,
            }}
          >
            Popular destinations
          </h2>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {DESTINATIONS.map((d) => (
              <Link
                key={d.id}
                href="/search"
                className="card-hover"
                style={{
                  height: 150,
                  borderRadius: 18,
                  background: d.img,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 18,
                  textDecoration: "none",
                }}
              >
                {/* dark overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div
                    style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "rgba(255,255,255,.7)",
                      marginTop: 2,
                    }}
                  >
                    {d.unis} universities &middot; {d.courses} courses
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular courses ── */}
        <section style={{ marginTop: 52 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-navy)",
                margin: 0,
              }}
            >
              Popular courses
            </h2>
            <Link
              href="/search"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-blue)",
                textDecoration: "none",
              }}
            >
              Browse all &rarr;
            </Link>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
          >
            {COURSES.map((c) => (
              <Link
                key={c.id}
                href={`/course/${c.id}`}
                className="card-hover"
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--color-line)",
                  padding: "20px 20px 18px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Top row: icon + level */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 11,
                      background: c.tint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      color: c.icColor,
                      flexShrink: 0,
                    }}
                  >
                    {c.abbr}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--color-muted)",
                    }}
                  >
                    {c.level} &middot; {c.duration}
                  </div>
                </div>

                {/* Title + uni */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    marginBottom: 4,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-sub)",
                  }}
                >
                  {c.uni}
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "var(--color-line)",
                    margin: "14px 0",
                  }}
                />

                {/* Tuition + intake */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--color-navy)",
                    }}
                  >
                    {c.tuition}
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      background: "var(--color-blue-x)",
                      color: "var(--color-blue)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {c.intake}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Two columns: Intakes + Scholarships ── */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6"
          style={{
            marginTop: 52,
          }}
        >
          {/* Intakes */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-navy)",
                marginBottom: 18,
              }}
            >
              Upcoming intakes
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid var(--color-line)",
                overflow: "hidden",
              }}
            >
              {INTAKES.map((ink, i) => (
                <div
                  key={ink.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderTop:
                      i > 0 ? "1px solid var(--color-line)" : "none",
                  }}
                >
                  {/* Date badge */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "var(--color-line-2)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--color-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {ink.mon}
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                        lineHeight: 1,
                      }}
                    >
                      {ink.day}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "var(--color-navy)",
                      }}
                    >
                      {ink.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-sub)",
                        marginTop: 2,
                      }}
                    >
                      {ink.sub}
                    </div>
                  </div>

                  {/* Tag */}
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      background: ink.tagBg,
                      color: ink.tagColor,
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {ink.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-navy)",
                marginBottom: 18,
              }}
            >
              Scholarship opportunities
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SCHOLARSHIPS.map((s) => (
                <div
                  key={s.name}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--color-line)",
                    padding: "18px 20px",
                    borderLeft: "4px solid var(--color-green)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--color-navy)",
                      marginBottom: 4,
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-sub)",
                      marginBottom: 10,
                    }}
                  >
                    {s.uni} &middot; {s.who}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "var(--color-green)",
                      }}
                    >
                      {s.amount}
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-muted)",
                      }}
                    >
                      Deadline: {s.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Student success stories ── */}
        <section style={{ marginTop: 52 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-navy)",
              marginBottom: 18,
            }}
          >
            Student success stories
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          >
            {STORIES.map((s) => (
              <div
                key={s.name}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--color-line)",
                  padding: "22px 22px 20px",
                }}
              >
                {/* Quote icon */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="var(--color-blue)"
                  style={{ marginBottom: 10, opacity: 0.25 }}
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--color-sub)",
                    margin: "0 0 14px",
                  }}
                >
                  {s.quote}
                </p>

                <div
                  style={{
                    height: 1,
                    background: "var(--color-line)",
                    margin: "0 0 14px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: s.av,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {s.initials}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--color-navy)",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-muted)",
                      }}
                    >
                      {s.dest}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent visa approvals ── */}
        <section style={{ marginTop: 52 }}>
          <div
            className="px-4 py-[18px] md:px-[26px] md:py-6"
            style={{
              background:
                "linear-gradient(135deg,var(--color-green-bg),#f2fbf5)",
              border: "1px solid #cdeed8",
              borderRadius: 20,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {/* Green check icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--color-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                  }}
                >
                  Recent visa approvals
                </div>
              </div>
              <span
                style={{
                  padding: "5px 14px",
                  borderRadius: 100,
                  background: "#fff",
                  border: "1px solid #cdeed8",
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--color-green)",
                }}
              >
                128 this month
              </span>
            </div>

            {/* Visa grid */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[14px]"
            >
              {VISAS.map((v) => (
                <div
                  key={v.name}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid #cdeed8",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: v.av,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {v.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "var(--color-navy)",
                        }}
                      >
                        {v.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-sub)",
                        }}
                      >
                        {v.dest}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--color-green)",
                      fontWeight: 600,
                    }}
                  >
                    ✓ {v.type} &middot; {v.when}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
