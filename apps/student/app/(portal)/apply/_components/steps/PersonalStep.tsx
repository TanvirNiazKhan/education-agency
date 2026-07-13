"use client";

import { FormState } from "../types";
import { FieldInput, FieldSelect, RadioPills } from "../FormFields";

interface PersonalStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function PersonalStep({ form, set }: PersonalStepProps) {
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
        A little about you
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Your personal details for the application.
      </p>

      {/* Scan passport CTA */}
      <div
        style={{
          border: "2px dashed var(--color-blue)",
          background: "var(--color-blue-x)",
          borderRadius: 14,
          padding: "20px 24px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--color-blue)" strokeWidth="1.8" />
          <circle cx="12" cy="11" r="3" stroke="var(--color-blue)" strokeWidth="1.8" />
          <path d="M7 17c0-2.21 2.24-4 5-4s5 1.79 5 4" stroke="var(--color-blue)" strokeWidth="1.8" />
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-blue)" }}>
            Save time — scan your passport
          </div>
          <div style={{ fontSize: 13, color: "var(--color-sub)", marginTop: 2 }}>
            We&apos;ll auto-fill your personal details from your passport photo.
          </div>
        </div>
        <button
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            background: "var(--color-blue)",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Scan passport
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <FieldInput label="First name" value={form.firstName} onChange={set("firstName")} />
        <FieldInput label="Last name" value={form.lastName} onChange={set("lastName")} />
        <div className="sm:col-span-2">
          <RadioPills
            label="Gender"
            value={form.gender}
            onChange={set("gender")}
            options={["Male", "Female"]}
          />
        </div>
        <FieldInput
          label="Date of birth"
          value={form.dob}
          onChange={set("dob")}
          type="date"
        />
        <FieldSelect
          label="Marital status"
          value={form.maritalStatus}
          onChange={set("maritalStatus")}
          options={["Single", "Married", "Divorced", "Widowed"]}
        />
        <div className="sm:col-span-2">
          <FieldInput label="Email" value={form.email} onChange={set("email")} />
        </div>
        <FieldInput label="Mobile" value={form.mobile} onChange={set("mobile")} />
        <FieldInput
          label="Home phone"
          value={form.homePhone}
          onChange={set("homePhone")}
          optional
        />
        <div className="sm:col-span-2">
          <FieldInput
            label="Skype"
            value={form.skype}
            onChange={set("skype")}
            optional
          />
        </div>
      </div>
    </div>
  );
}
