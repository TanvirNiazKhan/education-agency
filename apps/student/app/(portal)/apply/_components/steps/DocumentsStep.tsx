"use client";

import { DOCS_REQUIRED, DOCS_OPTIONAL } from "../../../../lib/data";

interface DocumentsStepProps {
  uploadedDocs: Set<string>;
  toggleDoc: (name: string) => void;
}

export function DocumentsStep({ uploadedDocs, toggleDoc }: DocumentsStepProps) {
  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: "0 0 6px",
        }}
      >
        Upload your documents
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Please upload the required documents for your application.
      </p>

      {/* Required */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
          Required documents
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            background: "var(--color-blue)",
            borderRadius: 10,
            padding: "2px 10px",
          }}
        >
          {DOCS_REQUIRED.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {DOCS_REQUIRED.map((d) => {
          const uploaded = uploadedDocs.has(d.name);
          return (
            <div
              key={d.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 14,
                border: "1px solid var(--color-line)",
                background: "#fff",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: uploaded ? "var(--color-green-bg)" : "var(--color-blue-x)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke={uploaded ? "var(--color-green)" : "var(--color-blue)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke={uploaded ? "var(--color-green)" : "var(--color-blue)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                  {d.name}
                </div>
                <div
                  style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}
                >
                  {d.hint}
                </div>
              </div>
              <button
                onClick={() => toggleDoc(d.name)}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: uploaded ? "var(--color-green)" : "var(--color-blue)",
                  background: uploaded ? "var(--color-green-bg)" : "var(--color-blue-x)",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {uploaded ? "Uploaded" : "Upload"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Optional */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
          Optional documents
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-muted)",
            background: "var(--color-line-2)",
            borderRadius: 10,
            padding: "2px 10px",
          }}
        >
          If applicable
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DOCS_OPTIONAL.map((d) => {
          const uploaded = uploadedDocs.has(d.name);
          return (
            <div
              key={d.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 14,
                border: "1px solid var(--color-line)",
                background: uploaded ? "#fff" : "var(--color-line-2)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: uploaded ? "var(--color-green-bg)" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke={uploaded ? "var(--color-green)" : "var(--color-muted)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke={uploaded ? "var(--color-green)" : "var(--color-muted)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                  {d.name}
                </div>
                <div
                  style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}
                >
                  {d.hint}
                </div>
              </div>
              <button
                onClick={() => toggleDoc(d.name)}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: uploaded ? "var(--color-green)" : "var(--color-muted)",
                  background: uploaded ? "var(--color-green-bg)" : "#fff",
                  border: uploaded ? "none" : "1px solid var(--color-line)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {uploaded ? "Uploaded" : "Upload"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
