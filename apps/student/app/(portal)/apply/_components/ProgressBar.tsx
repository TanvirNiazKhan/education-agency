"use client";

import { JOURNEY_STEPS } from "../../../lib/data";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  progress: number;
  institution: string;
  subtitle: string;
  universityType?: string | null;
  website?: string | null;
  logoUrl?: string | null;
}

export function ProgressBar({
  step,
  totalSteps,
  progress,
  institution,
  subtitle,
  universityType,
  website,
  logoUrl,
}: ProgressBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 66,
        zIndex: 40,
        background: "var(--color-card)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div
        className="px-4 lg:px-7"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          paddingTop: 14,
          paddingBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* University badge / logo */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: logoUrl ? "#fff" : "linear-gradient(135deg,#0e7490,#06b6d4)",
            border: logoUrl ? "1px solid var(--color-line)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 16,
            fontWeight: 800,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={institution}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
            />
          ) : (
            institution.charAt(0) || "?"
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: institution info left, step info right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {institution || "Choose your institution"}
              </span>
              {universityType && (
                <span
                  style={{
                    padding: "2px 9px",
                    borderRadius: 100,
                    background: "var(--color-blue-x)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--color-blue)",
                    flexShrink: 0,
                  }}
                >
                  {universityType}
                </span>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--color-blue)",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  Website ↗
                </a>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span
                className="hidden md:inline"
                style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-ink)" }}
              >
                Step {step + 1} of {totalSteps} &middot; {JOURNEY_STEPS[step]}
              </span>
              <span
                className="md:hidden"
                style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-ink)" }}
              >
                {step + 1}/{totalSteps}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--color-green)",
                  }}
                />
                <span
                  className="hidden sm:inline"
                  style={{ fontSize: 11.5, fontWeight: 600, color: "var(--color-muted)" }}
                >
                  Auto-saved
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--color-sub)",
                marginTop: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Row 3: progress bar */}
          <div
            style={{
              height: 6,
              background: "var(--color-line)",
              borderRadius: 3,
              marginTop: 7,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
                borderRadius: 3,
                transition: "width .3s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
