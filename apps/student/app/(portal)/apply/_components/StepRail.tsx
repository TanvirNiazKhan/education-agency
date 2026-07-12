"use client";

import { JOURNEY_STEPS } from "../../../lib/data";
import { CheckIcon } from "./FormFields";

interface StepRailProps {
  step: number;
  setStep: (s: number) => void;
}

export function StepRail({ step, setStep }: StepRailProps) {
  return (
    <div className="hidden lg:block" style={{ position: "sticky", top: 150, alignSelf: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {JOURNEY_STEPS.map((s, i) => {
          const completed = i < step;
          const current = i === step;
          return (
            <button
              key={s}
              onClick={() => setStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                background: current ? "var(--color-blue-x)" : "transparent",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 800,
                  flexShrink: 0,
                  ...(completed
                    ? { background: "var(--color-green)", color: "#fff" }
                    : current
                      ? { background: "var(--color-blue)", color: "#fff" }
                      : {
                          background: "transparent",
                          border: "2px solid var(--color-line)",
                          color: "var(--color-muted)",
                        }),
                }}
              >
                {completed ? <CheckIcon /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: current ? 800 : 600,
                  color: completed
                    ? "var(--color-green)"
                    : current
                      ? "var(--color-blue)"
                      : "var(--color-muted)",
                }}
              >
                {s}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
