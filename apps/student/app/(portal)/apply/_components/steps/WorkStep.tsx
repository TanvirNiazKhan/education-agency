"use client";

import { FormState } from "../types";
import { FieldInput, RadioPills } from "../FormFields";

interface WorkStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function WorkStep({ form, set }: WorkStepProps) {
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
        Any work experience?
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Let us know if you have any professional experience after your studies.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <div className="sm:col-span-2">
          <RadioPills
            label="Have you worked after completing your studies?"
            value={form.workedAfter}
            onChange={set("workedAfter")}
            options={["No", "Yes"]}
          />
        </div>
        {form.workedAfter === "Yes" && (
          <>
            <FieldInput
              label="Employer"
              value={form.employer}
              onChange={set("employer")}
            />
            <FieldInput
              label="Manager"
              value={form.manager}
              onChange={set("manager")}
            />
            <FieldInput
              label="Start date"
              value={form.workStart}
              onChange={set("workStart")}
              type="date"
            />
            <FieldInput
              label="End date"
              value={form.workEnd}
              onChange={set("workEnd")}
              type="date"
            />
            <div className="sm:col-span-2">
              <FieldInput
                label="Professional membership"
                value={form.profMembership}
                onChange={set("profMembership")}
                optional
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
