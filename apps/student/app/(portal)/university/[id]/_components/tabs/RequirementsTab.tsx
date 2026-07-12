"use client";

import { CourseWithFaculty, ApiCourse } from "../types";

interface RequirementsTabProps {
  courses: CourseWithFaculty[];
}

export default function RequirementsTab({ courses }: RequirementsTabProps) {
  const bandFields = ["speaking", "writing", "reading", "listening"] as const;

  // Derive overall scores
  const ieltsScores = courses
    .map((c) => c.ielts_requirement)
    .filter((s) => s > 0);
  const pteScores = courses
    .map((c) => c.pte_requirement)
    .filter((s) => s > 0);
  const toeflScores = courses
    .map((c) => c.toefl_requirement)
    .filter((s) => s > 0);
  const minIelts = ieltsScores.length > 0 ? Math.min(...ieltsScores) : null;
  const minPte = pteScores.length > 0 ? Math.min(...pteScores) : null;
  const minToefl = toeflScores.length > 0 ? Math.min(...toeflScores) : null;

  // Derive band scores
  const ieltsBands: Record<string, number | null> = {};
  const pteBands: Record<string, number | null> = {};
  const toeflBands: Record<string, number | null> = {};
  for (const band of bandFields) {
    const ieltsVals = courses.map((c) => c[`ielts_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    ieltsBands[band] = ieltsVals.length > 0 ? Math.min(...ieltsVals) : null;
    const pteVals = courses.map((c) => c[`pte_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    pteBands[band] = pteVals.length > 0 ? Math.min(...pteVals) : null;
    const toeflVals = courses.map((c) => c[`toefl_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    toeflBands[band] = toeflVals.length > 0 ? Math.min(...toeflVals) : null;
  }
  const hasIeltsBands = bandFields.some((b) => ieltsBands[b] != null);
  const hasPteBands = bandFields.some((b) => pteBands[b] != null);
  const hasToeflBands = bandFields.some((b) => toeflBands[b] != null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* IELTS */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          IELTS Academic
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minIelts ? `${minIelts}+` : "Varies by course"}
          </div>
        </div>
        {hasIeltsBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {ieltsBands[band] != null ? `${ieltsBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* PTE */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          PTE Academic
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minPte ? `${minPte}+` : "Varies by course"}
          </div>
        </div>
        {hasPteBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {pteBands[band] != null ? `${pteBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* TOEFL */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          TOEFL iBT
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minToefl ? `${minToefl}+` : "Varies by course"}
          </div>
        </div>
        {hasToeflBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {toeflBands[band] != null ? `${toeflBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Academic & documents */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          Academic &amp; documents
        </h3>
        {[
          "Bachelor's degree (min 3.0 GPA)",
          "Official academic transcripts",
          "Statement of purpose",
          "Two recommendation letters",
          "Updated CV / resume",
          "Valid passport copy",
        ].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--color-line)",
              fontSize: 14,
              color: "var(--color-ink)",
            }}
          >
            <span
              style={{
                color: "var(--color-green)",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
