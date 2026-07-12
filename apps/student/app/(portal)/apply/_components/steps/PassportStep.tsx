"use client";

import { FormState } from "../types";
import { FieldInput, FieldSelect, RadioPills } from "../FormFields";
import { ALL_COUNTRIES } from "../../../../lib/data";

interface PassportStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function PassportStep({ form, set }: PassportStepProps) {
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
        Your passport details
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        We need these details to verify your identity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <FieldInput
          label="Passport number"
          value={form.passportNo}
          onChange={set("passportNo")}
        />
        <FieldSelect
          label="Nationality"
          value={form.nationality}
          onChange={set("nationality")}
          options={ALL_COUNTRIES}
        />
        <FieldInput
          label="Date of issue"
          value={form.passIssueDate}
          onChange={set("passIssueDate")}
          type="date"
        />
        <FieldInput
          label="Date of expiry"
          value={form.passExpiryDate}
          onChange={set("passExpiryDate")}
          type="date"
        />
        <FieldInput
          label="Place of issue"
          value={form.passIssuePlace}
          onChange={set("passIssuePlace")}
        />
        <FieldInput
          label="Place of birth"
          value={form.passBirthPlace}
          onChange={set("passBirthPlace")}
        />
        <div className="sm:col-span-2">
          <RadioPills
            label="Previous visa refused?"
            value={form.visaRefused}
            onChange={set("visaRefused")}
            options={["No", "Yes"]}
            hint="If yes, please provide details in the documents step."
          />
        </div>
      </div>
    </div>
  );
}
