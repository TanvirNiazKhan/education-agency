"use client";

import { INPUT_STYLE, SELECT_STYLE, LABEL_STYLE } from "./types";

export function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  optional,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>
        {label}
        {optional && (
          <span style={{ fontWeight: 500, color: "var(--color-muted)", marginLeft: 4 }}>
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={INPUT_STYLE}
      />
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

export function FieldSelect({
  label,
  value,
  onChange,
  options,
  optional,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>
        {label}
        {optional && (
          <span style={{ fontWeight: 500, color: "var(--color-muted)", marginLeft: 4 }}>
            (optional)
          </span>
        )}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={SELECT_STYLE}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

export function RadioPills({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const selected = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              style={{
                padding: "10px 20px",
                borderRadius: 11,
                border: selected ? "1.5px solid var(--color-blue)" : "1px solid var(--color-line)",
                background: selected ? "var(--color-blue)" : "var(--color-line-2)",
                color: selected ? "#fff" : "var(--color-sub)",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 15,
        fontWeight: 800,
        color: "var(--color-navy)",
        margin: "28px 0 16px",
        paddingBottom: 10,
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      {children}
    </h3>
  );
}

export function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
