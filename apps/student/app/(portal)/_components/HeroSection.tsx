"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";

const ROTATING_WORDS = ["abroad", "in Australia", "in Canada", "in the UK"];

interface HeroSectionProps {
  suggestChips: string[];
  children?: React.ReactNode;
}

export default function HeroSection({ suggestChips, children }: HeroSectionProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const t = setInterval(
      () => setWordIdx((i) => (i + 1) % ROTATING_WORDS.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const currentWord = ROTATING_WORDS[wordIdx];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(120% 130% at 50% -20%,var(--color-blue-x) 0%,var(--color-bg) 55%)",
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
            background: "var(--color-card)",
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
          {user ? `Welcome back, ${user.first_name}` : "Welcome"}
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
              background: "var(--color-card)",
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
          {suggestChips.map((ch) => (
            <Link
              key={ch}
              href="/search"
              className="chip-hover whitespace-nowrap"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                background: "var(--color-card)",
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
            background: "var(--color-card)",
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

        {children}
      </div>
    </section>
  );
}
