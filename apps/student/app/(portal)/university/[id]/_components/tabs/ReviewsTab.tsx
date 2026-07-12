"use client";

import { REVIEWS } from "../../../../../lib/data";

export default function ReviewsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]">
      {REVIEWS.map((r, i) => (
        <div
          key={i}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px",
            border: "1px solid var(--color-line)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* stars */}
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-sub)",
              lineHeight: 1.65,
              flex: 1,
            }}
          >
            {r.text}
          </div>
          <div
            style={{
              height: 1,
              background: "var(--color-line)",
              margin: "14px 0",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: r.av,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {r.initials}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                {r.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
                {r.prog} · {r.yr}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
