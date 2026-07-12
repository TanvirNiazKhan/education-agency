"use client";

import { JOURNEY_STEPS } from "../../../lib/data";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  progress: number;
  institutionInitial: string;
}

export function ProgressBar({ step, totalSteps, progress, institutionInitial }: ProgressBarProps) {
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
        {/* University badge */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg,#0e7490,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {institutionInitial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
              Step {step + 1} of {totalSteps} &middot; {JOURNEY_STEPS[step]}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-green)",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)" }}>
                Auto-saved
              </span>
            </div>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--color-line)",
              borderRadius: 3,
              marginTop: 8,
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
