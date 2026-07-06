"use client";

import Link from "next/link";
import { UNIS, COMPARE_ROWS, COMPARE_EXTRA } from "../../lib/data";

const compareUnis = UNIS.slice(0, 3); // Melbourne, Toronto, Manchester

function buildValues(u: (typeof UNIS)[0]) {
  const extra = COMPARE_EXTRA[u.country];
  return [
    `#${u.rank}`,
    u.tuition,
    extra.living,
    u.schShort,
    u.ielts,
    u.pte,
    extra.duration,
    `${u.emp}%`,
    extra.internship,
    extra.visa,
    `${u.city}, ${u.country}`,
    extra.climate,
    `${u.sat}%`,
  ];
}

function bestIndex(rowIdx: number, allValues: string[][]) {
  const vals = allValues.map((v) => v[rowIdx]);
  // numeric-ish comparison: lower rank is better, lower tuition is better, higher emp/sat is better
  const lowerIsBetter = [0, 1, 2, 4, 5]; // rank, tuition, living, ielts, pte
  const higherIsBetter = [7, 12]; // employment, satisfaction

  if (lowerIsBetter.includes(rowIdx)) {
    const nums = vals.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")) || 999);
    const min = Math.min(...nums);
    return nums.indexOf(min);
  }
  if (higherIsBetter.includes(rowIdx)) {
    const nums = vals.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0);
    const max = Math.max(...nums);
    return nums.indexOf(max);
  }
  return -1;
}

export default function ComparePage() {
  const allValues = compareUnis.map(buildValues);

  return (
    <main className="px-4 py-6 pb-16 lg:px-7 lg:py-8 lg:pb-[90px]" style={{ maxWidth: 1160, margin: "0 auto" }}>
      {/* Header */}
      <h1
        className="text-2xl lg:text-[30px]"
        style={{
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: 0,
        }}
      >
        Compare universities
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--color-sub)",
          margin: "6px 0 28px",
          lineHeight: 1.55,
        }}
      >
        Side-by-side comparison of your{" "}
        <span style={{ color: "var(--color-green)", fontWeight: 700 }}>
          top 3 shortlisted
        </span>{" "}
        universities.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 18,
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
          minWidth: 700,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 1fr 1fr",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div
            style={{
              padding: "22px 24px",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Metric
          </div>
          {compareUnis.map((u) => (
            <div
              key={u.id}
              style={{
                padding: "22px 20px",
                borderLeft: "1px solid var(--color-line)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: u.img,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {u.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link
                    href={`/university/${u.id}`}
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--color-ink)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.name}
                  </Link>
                  <button
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "1px solid var(--color-line)",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "var(--color-muted)",
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    &times;
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-muted)",
                    marginTop: 2,
                  }}
                >
                  {u.city}, {u.country}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {COMPARE_ROWS.map((label, rowIdx) => {
          const best = bestIndex(rowIdx, allValues);
          return (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 1fr 1fr",
                borderBottom:
                  rowIdx < COMPARE_ROWS.length - 1
                    ? "1px solid var(--color-line)"
                    : "none",
                background:
                  rowIdx % 2 === 0 ? "transparent" : "var(--color-line-2)",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "var(--color-sub)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {label}
              </div>
              {compareUnis.map((u, colIdx) => (
                <div
                  key={u.id}
                  style={{
                    padding: "14px 20px",
                    borderLeft: "1px solid var(--color-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                  }}
                >
                  {best === colIdx && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--color-green)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {allValues[colIdx][rowIdx]}
                </div>
              ))}
            </div>
          );
        })}

        {/* Actions row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 1fr 1fr",
            borderTop: "1px solid var(--color-line)",
            background: "var(--color-line-2)",
          }}
        >
          <div style={{ padding: "18px 24px" }} />
          {compareUnis.map((u) => (
            <div
              key={u.id}
              style={{
                padding: "18px 20px",
                borderLeft: "1px solid var(--color-line)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Link
                href={`/apply?uni=${u.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  padding: "10px 28px",
                  borderRadius: 10,
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                className="lift-hover"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Add another university button */}
      <button
        style={{
          width: "100%",
          marginTop: 20,
          padding: "18px 0",
          borderRadius: 14,
          border: "2px dashed var(--color-line)",
          background: "transparent",
          fontSize: 14.5,
          fontWeight: 700,
          color: "var(--color-muted)",
          cursor: "pointer",
          transition: "border-color .15s, color .15s",
        }}
        className="chip-hover"
      >
        + Add another university
      </button>
    </main>
  );
}
