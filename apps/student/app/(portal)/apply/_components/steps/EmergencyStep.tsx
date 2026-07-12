"use client";

import { FormState } from "../types";
import { FieldInput, FieldSelect } from "../FormFields";

interface EmergencyStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function EmergencyStep({ form, set }: EmergencyStepProps) {
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
        Who should we contact in an emergency?
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        A family member or close friend we can reach if needed.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <FieldSelect
          label="Relationship"
          value={form.emRelationship}
          onChange={set("emRelationship")}
          options={["Parent", "Sibling", "Spouse", "Friend", "Other"]}
        />
        <FieldInput
          label="First name"
          value={form.emFirstName}
          onChange={set("emFirstName")}
        />
        <FieldInput
          label="Last name"
          value={form.emLastName}
          onChange={set("emLastName")}
        />
        <FieldInput label="Mobile" value={form.emMobile} onChange={set("emMobile")} />
        <FieldInput
          label="Other phone"
          value={form.emOtherPhone}
          onChange={set("emOtherPhone")}
          optional
        />
        <FieldInput
          label="Email"
          value={form.emEmail}
          onChange={set("emEmail")}
          optional
        />
      </div>
    </div>
  );
}
