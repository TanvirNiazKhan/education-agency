"use client";

import { FAQS } from "../../../../../lib/data";

export default function FaqTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {FAQS.map((f, i) => (
        <div
          key={i}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px 24px",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "var(--color-navy)",
              marginBottom: 8,
            }}
          >
            {f.q}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-sub)",
              lineHeight: 1.65,
            }}
          >
            {f.a}
          </div>
        </div>
      ))}
    </div>
  );
}
