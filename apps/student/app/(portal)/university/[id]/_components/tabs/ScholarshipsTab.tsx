"use client";

import { ApiScholarship } from "../types";

interface ScholarshipsTabProps {
  scholarships: ApiScholarship[];
}

export default function ScholarshipsTab({ scholarships }: ScholarshipsTabProps) {
  if (scholarships.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          color: "var(--color-muted)",
          fontSize: 14.5,
        }}
      >
        No scholarships listed yet for this university.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {scholarships.map((s) => (
        <div
          key={s.id}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px 24px",
            border: "1px solid var(--color-line)",
            borderLeft: "4px solid var(--color-green)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-navy)",
                marginBottom: 4,
              }}
            >
              {s.name}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-sub)" }}>
              {s.type}
              {s.deadline
                ? ` · Deadline: ${new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : ""}
            </div>
            {s.description && (
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--color-muted)",
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {s.description}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--color-green)",
              flexShrink: 0,
              marginLeft: 24,
            }}
          >
            {s.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
}
